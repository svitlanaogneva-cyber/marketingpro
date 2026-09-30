import type { Metadata } from "next";
import Home from "@/content/pages/home";
import Contact from "@/components/Contact";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, pages } from "@/lib/site";
import { faqLd, organizationLd } from "@/lib/schema";

export const metadata: Metadata = buildMetadata(pages.home);

export default function Page() {
  return (
    <>
      <JsonLd data={[...organizationLd(), faqLd()]} />
      <Home />
      <Contact />
    </>
  );
}
