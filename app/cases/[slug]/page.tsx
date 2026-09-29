import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Contact from "@/components/Contact";
import JsonLd from "@/components/JsonLd";
import { caseBodies } from "@/content/cases";
import { buildMetadata, cases } from "@/lib/site";

/* Усі кейси генеруються на етапі збірки — у HTML одразу є контент і метадані. */
export const dynamicParams = false;
export const generateStaticParams = () => cases.map((c) => ({ slug: c.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = cases.find((x) => x.slug === slug);
  return c ? buildMetadata(c) : {};
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const c = cases.find((x) => x.slug === slug);
  const Body = caseBodies[slug];
  if (!c || !Body) notFound();

  return (
    <>
      <JsonLd data={c.ld} />
      <nav className="case-back wrap" aria-label="Навігація">
        <Link href="/cases">
          <span className="arr" aria-hidden="true">←</span>
          <span className="lbl">Кейси</span>
        </Link>
      </nav>

      <article className="cpanel cpanel--page wrap">
        <Body />
      </article>

      <nav className="case-nav wrap" aria-label="Інші кейси">
        {c.prev && (
          <Link className="case-nav-prev" href={`/cases/${c.prev.slug}`}>
            <span className="dir" aria-hidden="true">←</span>
            <span className="w">
              <span className="lbl">Попередній кейс</span>
              <span className="nm">{c.prev.name}</span>
            </span>
          </Link>
        )}
        {c.next && (
          <Link className="case-nav-next" href={`/cases/${c.next.slug}`}>
            <span className="dir" aria-hidden="true">→</span>
            <span className="w">
              <span className="lbl">Наступний кейс</span>
              <span className="nm">{c.next.name}</span>
            </span>
          </Link>
        )}
      </nav>

      <Contact />
    </>
  );
}
