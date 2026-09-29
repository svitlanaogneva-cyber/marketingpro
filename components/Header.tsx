"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const home = pathname === "/";
  /* На головній — якорі в межах сторінки (скрол без навігації), на інших — на головну з якорем */
  const h = (hash: string) => (home ? hash : `/${hash}`);
  const cur = (p: string) => (pathname === p ? ({ "aria-current": "page" } as const) : {});

  return (
    <header className="site-header" id="top">
      <div className="wrap nav">
        {home ? (
          <a href="#top" className="brand" aria-label="marketingpro — на початок">
            marketing<span className="brand-pro">pro</span>
          </a>
        ) : (
          <Link href="/" className="brand" aria-label="marketingpro — на головну">
            marketing<span className="brand-pro">pro</span>
          </Link>
        )}
        <nav className="nav-links" id="navLinks" aria-label="Головна навігація">
          {home ? <a href="#top">Головна</a> : <Link href="/#top">Головна</Link>}
          {home ? <a href="#services">Послуги</a> : <Link href="/#services">Послуги</Link>}
          <Link href="/cases" {...cur("/cases")}>Кейси</Link>
          <Link href="/academy" {...cur("/academy")}>Академія</Link>
          {home ? (
            <a href="#contact" className="btn btn--signal nav-cta">Безкоштовна консультація</a>
          ) : (
            <Link href={h("#contact")} className="btn btn--signal nav-cta">Безкоштовна консультація</Link>
          )}
          <div className="nav-contacts">
            <a href="https://t.me/marketingpro_ua" target="_blank" rel="noopener">Telegram</a>
            <a href="https://www.instagram.com/marketingpro.company/" target="_blank" rel="noopener">Instagram</a>
            <a href="tel:+380637194373">+38 063 719 43 73</a>
          </div>
        </nav>
        <div className="nav-actions">
          {home ? (
            <a href="#contact" className="btn btn--signal">Безкоштовна консультація</a>
          ) : (
            <Link href="/#contact" className="btn btn--signal">Безкоштовна консультація</Link>
          )}
          <button className="nav-toggle" id="navToggle" aria-label="Відкрити меню" aria-expanded="false" aria-controls="navLinks">
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
