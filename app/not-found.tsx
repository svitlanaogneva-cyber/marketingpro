import Link from "next/link";

export default function NotFound() {
  return (
    <section className="hero wrap">
      <h1 className="h1">Сторінку не знайдено</h1>
      <p className="lead">Можливо, адресу змінено. Почніть з головної.</p>
      <Link href="/" className="btn btn--signal">На головну →</Link>
    </section>
  );
}
