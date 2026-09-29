import type { ComponentType } from "react";
import CaseApparel from "./apparel";
import CaseBags from "./bags";
import CaseBeauty from "./beauty";
import CaseDental from "./dental";
import CaseFlowers from "./flowers";
import CaseFurniture from "./furniture";
import CaseGym from "./gym";
import CaseKeratin from "./keratin";
import CaseLanguage from "./language";

/** Тіло кожного кейсу (метадані та порядок — у content/meta.json через lib/site.ts). */
export const caseBodies: Record<string, ComponentType> = {
  apparel: CaseApparel,
  bags: CaseBags,
  beauty: CaseBeauty,
  dental: CaseDental,
  flowers: CaseFlowers,
  furniture: CaseFurniture,
  gym: CaseGym,
  keratin: CaseKeratin,
  language: CaseLanguage,
};
