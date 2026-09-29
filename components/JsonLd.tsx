/** Структуровані дані для пошуковиків. `<` екрануємо, щоб JSON не міг закрити тег script. */
export default function JsonLd({ data }: { data: object[] }) {
  return (
    <>
      {data.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
