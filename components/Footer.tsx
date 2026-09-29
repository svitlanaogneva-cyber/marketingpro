import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="site-footer">
        <div className="wrap">
          <div className="foot-top">
            <div className="foot-brand">
              <span className="brand">
                marketing
                <span className="brand-pro">pro</span>
              </span>
              <p>
                Допомагаємо бізнесу стабільно рости та збільшувати прибуток. Купуємо лідів дешевше за конкурентів
              </p>
            </div>
            <div className="foot-cols">
              <div className="foot-col">
                <h4>сайт</h4>
                <Link href="/#services">Послуги</Link>
                <Link href="/cases">Кейси</Link>
                <Link href="/#founder">Про агенцію</Link>
              </div>
              <div className="foot-col">
                <h4>контакти</h4>
                <a href="https://www.instagram.com/marketingpro.company/" target="_blank" rel="noopener">Instagram</a>
                <a href="https://t.me/marketingpro_ua" target="_blank" rel="noopener">Telegram</a>
                <a href="viber://chat?number=%2B380637194373">Viber</a>
                <a href="tel:+380637194373">Телефон</a>
                <a href="mailto:marketingpro.ua@gmail.com">Пошта</a>
              </div>
              <div className="foot-col">
                <h4>дія</h4>
                <Link href="/#contact">Безкоштовна консультація</Link>
                <Link href="/academy">Академія</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
