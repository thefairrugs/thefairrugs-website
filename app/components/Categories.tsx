const categories = [
  {
    title: "Hand Tufted",
    sub: "Modern • Persian • Geometric • Irregular Shape",
    image: "/images/rug5.jpg",
  },
  {
    title: "Hand Knotted",
    sub: "Modern • Oushak • Persian",
    image: "/images/rug3.png",
  },
  {
    title: "Durrie",
    sub: "Flat Weave Collection",
    image: "/images/rug6.png",
  },
  {
    title: "Jute",
    sub: "Natural Handmade Jute Rugs",
    image: "/images/rug8.jpeg",
  },
];

export default function Categories() {
  return (
    <section
      style={{
        padding: "90px 60px",
        background: "#f8f6f3",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "42px",
          color: "#2d2d2d",
          marginBottom: "12px",
        }}
      >
        Shop by Rug Type
      </h2>

      <p
        style={{
          textAlign: "center",
          color: "#777",
          fontSize: "18px",
          marginBottom: "55px",
        }}
      >
        Choose from our handcrafted rug collections.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "28px",
        }}
      >
        {categories.map((item, index) => (
          <div
            key={index}
            style={{
              background: "#fff",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,.08)",
              transition: ".3s",
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
              }}
            />

            <div style={{ padding: "22px" }}>
              <h3
                style={{
                  marginBottom: "10px",
                  color: "#2d2d2d",
                  fontSize: "24px",
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  color: "#666",
                  lineHeight: "1.7",
                  minHeight: "60px",
                }}
              >
                {item.sub}
              </p>

              <button
                style={{
                  marginTop: "20px",
                  background: "#8B5E3C",
                  color: "#fff",
                  border: "none",
                  padding: "12px 22px",
                  borderRadius: "8px",
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                Explore Collection →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}