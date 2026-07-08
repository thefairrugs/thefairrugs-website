export default function FeaturedRugs() {
  const rugs = [
    {
      image: "/images/rug1.png",
      title: "Vintage Oushak Rug",
      price: "$249",
      oldPrice: "$399",
      reviews: "245 Reviews",
    },
    {
      image: "/images/rug2.png",
      title: "Moroccan Wool Rug",
      price: "$299",
      oldPrice: "$449",
      reviews: "198 Reviews",
    },
    {
      image: "/images/rug3.png",
      title: "Hand Knotted Wool Rug",
      price: "$399",
      oldPrice: "$549",
      reviews: "312 Reviews",
    },
    {
      image: "/images/rug4.jpg",
      title: "Geometric Area Rug",
      price: "$279",
      oldPrice: "$389",
      reviews: "156 Reviews",
    },
    {
      image: "/images/rug5.jpg",
      title: "Modern Abstract Rug",
      price: "$329",
      oldPrice: "$469",
      reviews: "287 Reviews",
    },
    {
      image: "/images/rug6.png",
      title: "Scandinavian Wool Rug",
      price: "$289",
      oldPrice: "$419",
      reviews: "175 Reviews",
    },
    {
      image: "/images/rug7.png",
      title: "Boho Handmade Rug",
      price: "$259",
      oldPrice: "$379",
      reviews: "221 Reviews",
    },
    {
      image: "/images/rug8.jpeg",
      title: "Custom Tufted Rug",
      price: "$349",
      oldPrice: "$499",
      reviews: "268 Reviews",
    },
  ];

  return (
    <section style={{ padding: "70px 50px", background: "#faf8f5" }}>
      <h2
        style={{
          textAlign: "center",
          fontSize: "38px",
          marginBottom: "10px",
          color: "#333",
        }}
      >
        Featured Rugs
      </h2>

      <p
        style={{
          textAlign: "center",
          color: "#777",
          marginBottom: "50px",
        }}
      >
        Explore our handcrafted luxury rug collection.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "30px",
        }}
      >
        {rugs.map((rug, index) => (
          <div
            key={index}
            style={{
              background: "#fff",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              transition: "0.3s",
            }}
          >
            <img
              src={rug.image}
              alt={rug.title}
              style={{
                width: "100%",
                height: "260px",
                objectFit: "cover",
              }}
            />

            <div style={{ padding: "18px" }}>
              <h3
                style={{
                  margin: "0 0 10px",
                  fontSize: "20px",
                  color: "#333",
                }}
              >
                {rug.title}
              </h3>

              <p style={{ color: "#f4b400", margin: "8px 0" }}>
                ★★★★★
                <span style={{ color: "#666" }}>
                  {" "}
                  ({rug.reviews})
                </span>
              </p>

              <p style={{ marginTop: "10px" }}>
                <span
                  style={{
                    fontSize: "22px",
                    fontWeight: "bold",
                    color: "#8B5E3C",
                  }}
                >
                  {rug.price}
                </span>

                <span
                  style={{
                    marginLeft: "10px",
                    textDecoration: "line-through",
                    color: "#999",
                  }}
                >
                  {rug.oldPrice}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}