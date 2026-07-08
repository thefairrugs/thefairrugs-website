type Props = {
  rugType: string;
  category: string;
  shape: string;
  size: string;
  sqft: number;
  price: number;
};

export default function PriceSummary({
  rugType,
  category,
  shape,
  size,
  sqft,
  price,
}: Props) {
  return (
    <div style={{
      background:"#fff",
      borderRadius:"18px",
      padding:"28px",
      boxShadow:"0 12px 30px rgba(0,0,0,.08)",
      position:"sticky",
      top:"30px"
    }}>
      <h2 style={{fontSize:"28px",color:"#8B5E3C",marginBottom:"20px"}}>Order Summary</h2>

      {[
        ["Material", rugType],
        ["Category", category],
        ["Shape", shape],
        ["Size", size],
        ["Total Sq.ft", sqft.toFixed(2)]
      ].map(([k,v])=>(
        <div key={String(k)} style={{display:"flex",justifyContent:"space-between",marginBottom:"14px"}}>
          <span>{k}</span><b>{v}</b>
        </div>
      ))}

      <hr style={{margin:"20px 0"}}/>

      <div style={{display:"flex",justifyContent:"space-between",fontSize:"30px",fontWeight:"bold",color:"#8B5E3C"}}>
        <span>Total</span>
        <span>${price.toFixed(0)}</span>
      </div>

      <div style={{marginTop:"20px",padding:"16px",background:"#F8F4EF",borderRadius:"12px",lineHeight:"30px"}}>
        ✅ Free Worldwide Shipping<br/>
        🚚 Production: 3–5 Weeks<br/>
        📦 Delivery: 4–7 Days<br/>
        ⭐ Handmade in India
      </div>

      <button style={{width:"100%",marginTop:"22px",padding:"16px",background:"#8B5E3C",color:"#fff",border:"none",borderRadius:"10px",fontWeight:"bold",fontSize:"18px"}}>
        Add To Quote
      </button>

      <button style={{width:"100%",marginTop:"14px",padding:"16px",background:"#25D366",color:"#fff",border:"none",borderRadius:"10px",fontWeight:"bold",fontSize:"18px"}}>
        WhatsApp Us
      </button>

      <button style={{width:"100%",marginTop:"14px",padding:"16px",background:"#fff",color:"#8B5E3C",border:"2px solid #8B5E3C",borderRadius:"10px",fontWeight:"bold",fontSize:"17px"}}>
        Request Custom Design
      </button>
    </div>
  );
}
