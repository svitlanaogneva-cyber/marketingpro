import type { Metadata } from "next";
import CasesIndex from "@/content/pages/cases-index";
import Contact from "@/components/Contact";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, pages } from "@/lib/site";

export const metadata: Metadata = buildMetadata(pages["cases-index"]);

export default function Page() {
  return (
    <>
      <JsonLd data={pages["cases-index"].ld} />
      <CasesIndex />
      <Contact />
    </>
  );
}
