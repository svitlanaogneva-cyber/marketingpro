import Link from "next/link";

export default function StickyCta() {
  return (
    <div className="sticky-cta" id="stickyCta">
      <Link href="/#contact" className="btn btn--signal">Безкоштовна консультація →</Link>
    </div>
  );
}
