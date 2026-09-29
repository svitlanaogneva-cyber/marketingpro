import type { Metadata } from "next";
import Academy from "@/content/pages/academy";
import ContactAcademy from "@/components/ContactAcademy";
import { buildMetadata, pages } from "@/lib/site";

export const metadata: Metadata = buildMetadata(pages.academy);

export default function Page() {
  return (
    <>
      <Academy />
      <ContactAcademy />
    </>
  );
}
