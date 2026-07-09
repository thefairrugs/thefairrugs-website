export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MessageInbox from "./MessageInbox";

export const metadata: Metadata = {
  title: "Message Inbox — The Fair Rugs",
  description: "View your conversation with The Fair Rugs team.",
  robots: "noindex,nofollow",
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function MessagesPage({ params }: Props) {
  const { token } = await params;
  return (
    <>
      <Header />
      <main>
        <MessageInbox token={token} />
      </main>
      <Footer />
    </>
  );
}
