import type { Metadata } from "next";
import Academy from "@/content/pages/academy";
import ContactAcademy from "@/components/ContactAcademy";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, pages } from "@/lib/site";
import { breadcrumbLd, coursesLd } from "@/lib/schema";

export const metadata: Metadata = buildMetadata(pages.academy);

export default function Page() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: "Головна", path: "/" }, { name: "Академія" }]), ...coursesLd()]} />
      <Academy />
      <ContactAcademy />
    </>
  );
}
