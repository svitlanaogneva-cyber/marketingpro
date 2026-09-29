import type { Metadata } from "next";
import Home from "@/content/pages/home";
import Contact from "@/components/Contact";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, pages } from "@/lib/site";

export const metadata: Metadata = buildMetadata(pages.home);

export default function Page() {
  return (
    <>
      <JsonLd data={pages.home.ld} />
      <Home />
      <Contact />
    </>
  );
}
