export default function Hero() {
  return (
    <section
      style={{
        background: "#f5f0e8",
        padding: "100px 40px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          letterSpacing: "3px",
          color: "#8B5E3C",
          fontWeight: "bold",
          marginBottom: "15px",
        }}
      >
        THE FAIR RUGS
      </p>

      <h1
        style={{
          fontSize: "56px",
          margin: "0",
          color: "#2F2F2F",
          lineHeight: "1.2",
        }}
      >
        Luxury Handmade Rugs
      </h1>

      <h2
        style={{
          fontSize: "28px",
          fontWeight: "normal",
          color: "#555",
          marginTop: "15px",
        }}
      >
        Crafted in India • Loved Worldwide
      </h2>

      <p
        style={{
          maxWidth: "700px",
          margin: "30px auto",
          fontSize: "18px",
          color: "#666",
          lineHeight: "1.8",
        }}
      >
        Discover handcrafted rugs made by skilled artisans using premium
        materials. Every rug is created with care for homes that value quality,
        craftsmanship, and timeless design.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "40px",
        }}
      >
        <button
          style={{
            background: "#8B5E3C",
            color: "white",
            padding: "16px 35px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            borderRadius: "8px",
          }}
        >
          Shop Collection
        </button>

        <button
          style={{
            background: "white",
            color: "#8B5E3C",
            padding: "16px 35px",
            border: "2px solid #8B5E3C",
            cursor: "pointer",
            fontSize: "16px",
            borderRadius: "8px",
          }}
        >
          Custom Rug
        </button>
      </div>
    </section>
  );
}