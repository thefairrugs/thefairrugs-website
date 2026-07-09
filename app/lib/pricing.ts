/**
 * THE FAIR RUGS — Shared Pricing Engine
 * Single source of truth: ONE engine used by Product pages AND Custom Rug page.
 *
 * Size Master lives in  data/sizes.json   (editable from Admin Panel)
 * Pricing lives in      data/pricing.json (editable from Admin Panel)
 * Static fallbacks in   app/data/sizes.ts + app/data/rugTypes.ts
 */

// ── Static fallbacks (used server-side and as TypeScript types) ───────────────
import { sizes as staticSizes } from "../data/sizes";
import { rugTypes as staticRugTypes } from "../data/rugTypes";

export { staticSizes as sizes, staticRugTypes as rugTypes };

// ── Types ─────────────────────────────────────────────────────────────────────
export interface SizeMasterItem {
  id: string;
  shape: "Rectangular" | "Runner" | "Round" | string;
  name: string;
  cm: string;
  sqft: number;
  active?: boolean;
}

export interface PricingItem {
  id: string;
  name: string;
  pricePerSqft: number;
}

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

// ── Pile height multipliers ───────────────────────────────────────────────────
export const PILE_HEIGHTS = [
  { id: "flat",   label: "Flat Weave",          multiplier: 0.85, desc: "No pile, reversible" },
  { id: "low",    label: "Low Pile",             multiplier: 0.95, desc: "5–8 mm" },
  { id: "medium", label: "Medium Pile",          multiplier: 1.00, desc: "10–12 mm (standard)" },
  { id: "high",   label: "High Pile",            multiplier: 1.15, desc: "15–18 mm" },
  { id: "shaggy", label: "Shaggy / Extra High",  multiplier: 1.25, desc: "20+ mm" },
];

// ── Convert legacy sizes array → SizeMasterItem[] ────────────────────────────
export function legacySizesToMaster(
  arr: Array<{ name: string; cm: string; sqft: number }>
): SizeMasterItem[] {
  return arr.map((s, i) => {
    let shape: string = "Rectangular";
    if (s.name.toLowerCase().includes("runner")) shape = "Runner";
    else if (s.name.toLowerCase().includes("round")) shape = "Round";
    return { id: `legacy-${i}`, shape, name: s.name, cm: s.cm, sqft: s.sqft, active: true };
  });
}

// ── Get price per sqft for a rug type (from live pricing array) ───────────────
export function getPricePerSqft(rugTypeId: string, pricing?: PricingItem[]): number {
  const src = pricing || staticRugTypes.map(r => ({ id: r.id, name: r.name, pricePerSqft: r.price }));
  const found = src.find(p => p.id === rugTypeId);
  return found ? found.pricePerSqft : 11;
}

// ── Map product construction → rugType id ─────────────────────────────────────
export function constructionToRugType(construction: string): string {
  const c = construction.toLowerCase();
  if (c.includes("knotted")) return "hand-knotted";
  if (c.includes("tufted")) return "hand-tufted";
  if (c.includes("durrie") || c.includes("flat")) return "durrie";
  if (c.includes("jute") || c.includes("woven")) return "jute";
  return "hand-tufted";
}

// ── Parse custom size W × H (in ft) → sqft ───────────────────────────────────
export function parseCustomSqft(width: string, height: string): number {
  const w = parseFloat(width);
  const h = parseFloat(height);
  if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return 0;
  return w * h;
}

// ── Core price calculation ────────────────────────────────────────────────────
export function computePrice(
  sqft: number,
  rugTypeId: string,
  pileMultiplier = 1.0,
  discount?: { enabled: boolean; type: "percent" | "fixed"; value: number },
  pricing?: PricingItem[],
  priceAdjustment = 0  // per-product +/- per sqft on top of category base
): PriceResult {
  const pricePerSqft = (getPricePerSqft(rugTypeId, pricing) + priceAdjustment) * pileMultiplier;
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

// ── Format sq.ft for display ──────────────────────────────────────────────────
export function formatSqft(sqft: number): string {
  return `${sqft % 1 === 0 ? sqft : sqft.toFixed(1)} sq.ft`;
}

// ── Get a single size by name from a master list ──────────────────────────────
export function getSizeByName(name: string, master?: SizeMasterItem[]): SizeMasterItem | undefined {
  const src = master || legacySizesToMaster(staticSizes);
  return src.find(s => s.name === name);
}

// ── Shape groups for display ──────────────────────────────────────────────────
export const SHAPE_ORDER = ["Rectangular", "Runner", "Round"];

export function groupSizesByShape(sizes: SizeMasterItem[]): Record<string, SizeMasterItem[]> {
  const groups: Record<string, SizeMasterItem[]> = {};
  for (const s of sizes) {
    if (s.active === false) continue;
    if (!groups[s.shape]) groups[s.shape] = [];
    groups[s.shape].push(s);
  }
  return groups;
}
