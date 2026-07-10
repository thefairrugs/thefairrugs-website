import { Metadata } from "next";
import TrackingClient from "./TrackingClient";

export const metadata: Metadata = {
  title: "Track Your Order | The Fair Rugs",
  description: "Track your handmade rug order in real-time. See production updates, shipping status, tracking number, and estimated delivery date.",
  robots: { index: false, follow: false },
};

export default function OrderTrackingPage() {
  return <TrackingClient />;
}
