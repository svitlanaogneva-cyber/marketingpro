"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initEffects } from "@/lib/effects";

/** Оживляє серверну розмітку після гідратації; перезапускається при зміні сторінки. */
export default function Effects() {
  const pathname = usePathname();
  useEffect(() => initEffects(), [pathname]);
  return null;
}
