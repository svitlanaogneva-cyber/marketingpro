import type { Metadata } from "next";
import CasesIndex from "@/content/pages/cases-index";
import Contact from "@/components/Contact";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, pages } from "@/lib/site";
import { breadcrumbLd, casesListLd } from "@/lib/schema";

export const metadata: Metadata = buildMetadata(pages["cases-index"]);

export default function Page() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: "Головна", path: "/" }, { name: "Кейси" }]), casesListLd()]} />
      <CasesIndex />
      <Contact />
    </>
  );
}
