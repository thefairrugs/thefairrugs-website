"use client";

import { useMemo, useState } from "react";
import { rugTypes } from "../data/rugTypes";
import { sizes } from "../data/sizes";
import PriceSummary from "./PriceSummary";

export default function PriceCalculator() {
  const [rugType, setRugType] = useState(rugTypes[0]);
  const [category, setCategory] = useState(rugTypes[0].categories[0]);

  const [shape, setShape] = useState("Rectangle");

  const [selectedSize, setSelectedSize] = useState(sizes[0]);

  const [customWidth, setCustomWidth] = useState("");

  const [customLength, setCustomLength] = useState("");

  const isCustom = shape === "Custom";

  const sqft = useMemo(() => {
    if (isCustom) {
      const w = Number(customWidth);
      const l = Number(customLength);

      if (!w || !l) return 0;

      const widthFeet = w / 30.48;
      const lengthFeet = l / 30.48;

      return widthFeet * lengthFeet;
    }

    return selectedSize.sqft;
  }, [
    customWidth,
    customLength,
    selectedSize,
    isCustom,
  ]);

  const totalPrice = useMemo(() => {
    return sqft * rugType.price;
  }, [sqft, rugType]);

  return (
    <section
      style={{
        maxWidth: "1400px",
        margin: "60px auto",
        padding: "40px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "44px",
          marginBottom: "12px",
        }}
      >
        Build Your Rug
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#777",
          marginBottom: "45px",
        }}
      >
        Design your handmade rug in just a few clicks.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "35px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "35px",
            boxShadow: "0 12px 35px rgba(0,0,0,.08)",
          }}
        >
          <label
            style={{
              fontWeight: "bold",
            }}
          >
            Rug Type
          </label>

          <select
            value={rugType.id}
            onChange={(e) => {
              const selected = rugTypes.find(
                (x) => x.id === e.target.value
              )!;

              setRugType(selected);
              setCategory(selected.categories[0]);
            }}
            style={{
              width: "100%",
              padding: "15px",
              marginTop: "8px",
              marginBottom: "25px",
            }}
          >
            {rugTypes.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>
            ))}
          </select>

          <label
            style={{
              fontWeight: "bold",
            }}
          >
            Category
          </label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            style={{
              width: "100%",
              padding: "15px",
              marginTop: "8px",
              marginBottom: "25px",
            }}
          >
            {rugType.categories.map((cat) => (
              <option key={cat}>
                {cat}
              </option>
            ))}
          </select>
                    <label
            style={{
              fontWeight: "bold",
            }}
          >
            Shape
          </label>

          <select
            value={shape}
            onChange={(e) => setShape(e.target.value)}
            style={{
              width: "100%",
              padding: "15px",
              marginTop: "8px",
              marginBottom: "25px",
            }}
          >
            <option>Rectangle</option>
            <option>Runner</option>
            <option>Round</option>
            <option>Square</option>
            <option>Oval</option>
            <option>Irregular</option>
            <option>Custom</option>
          </select>

          {!isCustom && (
            <>
              <label
                style={{
                  fontWeight: "bold",
                }}
              >
                Standard Size
              </label>

              <select
                value={selectedSize.name}
                onChange={(e) =>
                  setSelectedSize(
                    sizes.find(
                      (s) => s.name === e.target.value
                    )!
                  )
                }
                style={{
                  width: "100%",
                  padding: "15px",
                  marginTop: "8px",
                  marginBottom: "25px",
                }}
              >
                {sizes.map((item) => (
                  <option
                    key={item.name}
                    value={item.name}
                  >
                    {item.name} ({item.cm})
                  </option>
                ))}
              </select>
            </>
          )}

          {isCustom && (
            <>
              <label
                style={{
                  fontWeight: "bold",
                }}
              >
                Width (CM)
              </label>

              <input
                value={customWidth}
                onChange={(e) =>
                  setCustomWidth(e.target.value)
                }
                placeholder="Width in CM"
                style={{
                  width: "100%",
                  padding: "15px",
                  marginTop: "8px",
                  marginBottom: "20px",
                }}
              />

              <label
                style={{
                  fontWeight: "bold",
                }}
              >
                Length (CM)
              </label>

              <input
                value={customLength}
                onChange={(e) =>
                  setCustomLength(e.target.value)
                }
                placeholder="Length in CM"
                style={{
                  width: "100%",
                  padding: "15px",
                  marginTop: "8px",
                }}
              />
            </>
          )}
                  </div>

        <PriceSummary
          rugType={rugType.name}
          category={category}
          shape={shape}
          size={
            isCustom
              ? `${customWidth || 0} × ${customLength || 0} CM`
              : `${selectedSize.name} (${selectedSize.cm})`
          }
          sqft={sqft}
          price={totalPrice}
        />
      </div>
    </section>
  );
}