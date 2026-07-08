/**
 * THE FAIR RUGS — Shared Pricing Engine
 * Used by both /custom-rug and /products/[slug] pages
 * Single source of truth for all size + price calculations.
 */

import { sizes } from "../data/sizes";
import { rugTypes } from "../data/rugTypes";

export { sizes, rugTypes };

export interface SizeOption {
  name: string;
  cm: string;
  sqft: number;
}

export interface PriceResult {
  sqft: number;
  pricePerSqft: number;
  basePrice: number;
  discountedPrice: number | null;
  displayPrice: number;
  savingsAmount: number;
  savingsPct: number;
  priceLabel: string;
  perSqftLabel: string;
}

// ── Pile height multipliers ──────────────────────────────────────────────────
export const PILE_HEIGHTS = [
  { id: "flat",   label: "Flat Weave",     multiplier: 0.85, desc: "No pile, reversible" },
  { id: "low",    label: "Low Pile",        multiplier: 0.95, desc: "5–8 mm" },
  { id: "medium", label: "Medium Pile",     multiplier: 1.00, desc: "10–12 mm (standard)" },
  { id: "high",   label: "High Pile",       multiplier: 1.15, desc: "15–18 mm" },
  { id: "shaggy", label: "Shaggy / Extra High", multiplier: 1.25, desc: "20+ mm" },
];

// ── Get base price/sqft for a rug type ───────────────────────────────────────
export function getPricePerSqft(rugTypeId: string): number {
  const rt = rugTypes.find((r) => r.id === rugTypeId);
  return rt ? rt.price : 11; // default hand-tufted
}

// ── Map product construction to a rugType id ──────────────────────────────────
export function constructionToRugType(construction: string): string {
  const c = construction.toLowerCase();
  if (c.includes("knotted")) return "hand-knotted";
  if (c.includes("tufted")) return "hand-tufted";
  if (c.includes("durrie") || c.includes("flat")) return "durrie";
  if (c.includes("jute") || c.includes("woven")) return "jute";
  return "hand-tufted";
}

// ── Parse custom size input "W x H" in feet → sqft ──────────────────────────
export function parseCustomSqft(width: string, height: string): number {
  const w = parseFloat(width);
  const h = parseFloat(height);
  if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return 0;
  return w * h;
}

// ── Compute price from sqft + rugTypeId + pileMultiplier ─────────────────────
export function computePrice(
  sqft: number,
  rugTypeId: string,
  pileMultiplier = 1.0,
  discount?: { enabled: boolean; type: "percent" | "fixed"; value: number }
): PriceResult {
  const pricePerSqft = getPricePerSqft(rugTypeId) * pileMultiplier;
  const basePrice = sqft * pricePerSqft;

  let discountedPrice: number | null = null;
  let savingsAmount = 0;
  let savingsPct = 0;

  if (discount?.enabled && discount.value > 0 && basePrice > 0) {
    if (discount.type === "percent") {
      savingsAmount = basePrice * (discount.value / 100);
      discountedPrice = basePrice - savingsAmount;
      savingsPct = discount.value;
    } else {
      savingsAmount = Math.min(discount.value, basePrice);
      discountedPrice = basePrice - savingsAmount;
      savingsPct = Math.round((savingsAmount / basePrice) * 100);
    }
  }

  const displayPrice = discountedPrice !== null ? discountedPrice : basePrice;

  return {
    sqft,
    pricePerSqft,
    basePrice,
    discountedPrice,
    displayPrice,
    savingsAmount,
    savingsPct,
    priceLabel: basePrice > 0 ? `$${Math.round(displayPrice).toLocaleString()}` : "—",
    perSqftLabel: `$${pricePerSqft.toFixed(2)}/sq.ft`,
  };
}

// ── Get size from standard list ───────────────────────────────────────────────
export function getSizeByName(name: string): SizeOption | undefined {
  return sizes.find((s) => s.name === name);
}

// ── Format sq.ft display ──────────────────────────────────────────────────────
export function formatSqft(sqft: number): string {
  return `${sqft % 1 === 0 ? sqft : sqft.toFixed(1)} sq.ft`;
}
