import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

/**
 * Знак бренду: рожевий квадрат із білою «m» (як у поточному фавікону). Одне джерело для favicon/PNG/Apple-іконки.
 * `rounded` — для звичайних іконок; Apple-іконка має бути повним квадратом (iOS сама заокруглює кути).
 */
export async function brandIcon(size: number, rounded: boolean) {
  const font = await readFile(path.join(process.cwd(), "node_modules/@fontsource/unbounded/files/unbounded-latin-700-normal.woff"));
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
          background: "#FF2D7E",
          borderRadius: rounded ? Math.round(size * 0.22) : 0,
          color: "#fff",
          fontFamily: "Unbounded",
          fontWeight: 700,
          fontSize: Math.round(size * 0.62),
          paddingBottom: Math.round(size * 0.05),
        }}
      >
        m
      </div>
    ),
    { width: size, height: size, fonts: [{ name: "Unbounded", data: font, weight: 700, style: "normal" }] },
  );
}
