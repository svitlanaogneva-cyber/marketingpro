import Link from "next/link";
import Image from "next/image";

export default function CasesIndex() {
  return (
    <>
      <section className="hero wrap">
        <div className="hero-top fade">
          <div>
            <h1 className="display display--tight" data-split="" data-split-delay="0.15">Кейси в цифрах</h1>
          </div>
        </div>
      </section>
      <section className="wrap" style={{ paddingBottom: "clamp(40px,6vw,90px)" }}>
        <div className="ccards-grid" id="caseCards">
          <Link className="ccard" href="/cases/furniture">
            <span className="ccard-media">
              <Image src="/assets/img/cases/furniture/cover.jpg" alt="" width="900" height="675" sizes="(max-width: 700px) 100vw, 420px" />
              {" "}
              <span className="ccard-fallback" aria-hidden="true">
                <span className="v">2584%</span>
                <span className="k">roas</span>
              </span>
            </span>
            {" "}
            <span className="ccard-body">
              <span className="nm">Виробництво меблів</span>
              {" "}
              <span className="ttl">167 продажів на місяць і окремий потік B2B-замовлень від дизайнерів.</span>
            </span>
            {" "}
            <span className="go">
              Розбір кейсу{" "}
              <span className="arr" aria-hidden="true">→</span>
            </span>
          </Link>
          {" "}
          <Link className="ccard" href="/cases/apparel">
            <span className="ccard-media">
              <Image src="/assets/img/cases/apparel/cover.jpg" alt="" width="900" height="675" sizes="(max-width: 700px) 100vw, 420px" />
              {" "}
              <span className="ccard-fallback" aria-hidden="true">
                <span className="v">×10</span>
                <span className="k">дохід</span>
              </span>
            </span>
            {" "}
            <span className="ccard-body">
              <span className="nm">Український бренд одягу з власним виробництвом</span>
              {" "}
              <span className="ttl">Дохід з реклами виріс удесятеро за рік роботи.</span>
            </span>
            {" "}
            <span className="go">
              Розбір кейсу{" "}
              <span className="arr" aria-hidden="true">→</span>
            </span>
          </Link>
          {" "}
          <Link className="ccard" href="/cases/language">
            <span className="ccard-media">
              <Image src="/assets/img/cases/language/cover.jpg" alt="" width="900" height="675" sizes="(max-width: 700px) 100vw, 420px" />
              {" "}
              <span className="ccard-fallback" aria-hidden="true">
                <span className="v">1168%</span>
                <span className="k">roas</span>
              </span>
            </span>
            {" "}
            <span className="ccard-body">
              <span className="nm">Школа іноземних мов</span>
              {" "}
              <span className="ttl">137 нових учнів на місяць — групи заповнюються рівномірно.</span>
            </span>
            {" "}
            <span className="go">
              Розбір кейсу{" "}
              <span className="arr" aria-hidden="true">→</span>
            </span>
          </Link>
          {" "}
          <Link className="ccard" href="/cases/bags">
            <span className="ccard-media">
              <Image src="/assets/img/cases/bags/cover.jpg" alt="" width="900" height="675" sizes="(max-width: 700px) 100vw, 420px" />
              {" "}
              <span className="ccard-fallback" aria-hidden="true">
                <span className="v">961%</span>
                <span className="k">roas</span>
              </span>
            </span>
            {" "}
            <span className="ccard-body">
              <span className="nm">Онлайн-магазин жіночих сумок</span>
              {" "}
              <span className="ttl">Дохід з реклами ×7 за дев'ять місяців після невдалих запусків.</span>
            </span>
            {" "}
            <span className="go">
              Розбір кейсу{" "}
              <span className="arr" aria-hidden="true">→</span>
            </span>
          </Link>
          {" "}
          <Link className="ccard" href="/cases/flowers">
            <span className="ccard-media">
              <Image src="/assets/img/cases/flowers/cover.jpg" alt="" width="900" height="675" sizes="(max-width: 700px) 100vw, 420px" />
              {" "}
              <span className="ccard-fallback" aria-hidden="true">
                <span className="v">4,28$</span>
                <span className="k">клієнт</span>
              </span>
            </span>
            {" "}
            <span className="ccard-body">
              <span className="nm">Мережа магазинів квітів</span>
              {" "}
              <span className="ttl">Вартість клієнта впала в шість разів — відкрили ще два магазини.</span>
            </span>
            {" "}
            <span className="go">
              Розбір кейсу{" "}
              <span className="arr" aria-hidden="true">→</span>
            </span>
          </Link>
          {" "}
          <Link className="ccard" href="/cases/dental">
            <span className="ccard-media">
              <Image src="/assets/img/cases/dental/cover.jpg" alt="" width="900" height="675" sizes="(max-width: 700px) 100vw, 420px" />
              {" "}
              <span className="ccard-fallback" aria-hidden="true">
                <span className="v">×3</span>
                <span className="k">дохід</span>
              </span>
            </span>
            {" "}
            <span className="ccard-body">
              <span className="nm">Стоматологічна клініка</span>
              {" "}
              <span className="ttl">За два місяці дохід клініки з реклами зріс утричі.</span>
            </span>
            {" "}
            <span className="go">
              Розбір кейсу{" "}
              <span className="arr" aria-hidden="true">→</span>
            </span>
          </Link>
          {" "}
          <Link className="ccard" href="/cases/beauty">
            <span className="ccard-media">
              <Image src="/assets/img/cases/beauty/cover.jpg" alt="" width="900" height="675" sizes="(max-width: 700px) 100vw, 420px" />
              {" "}
              <span className="ccard-fallback" aria-hidden="true">
                <span className="v">829%</span>
                <span className="k">roas</span>
              </span>
            </span>
            {" "}
            <span className="ccard-body">
              <span className="nm">Студія краси повного циклу</span>
              {" "}
              <span className="ttl">Графік майстрів заповнений без «порожніх» днів.</span>
            </span>
            {" "}
            <span className="go">
              Розбір кейсу{" "}
              <span className="arr" aria-hidden="true">→</span>
            </span>
          </Link>
          {" "}
          <Link className="ccard" href="/cases/gym">
            <span className="ccard-media">
              <Image src="/assets/img/cases/gym/cover.jpg" alt="" width="900" height="675" sizes="(max-width: 700px) 100vw, 420px" />
              {" "}
              <span className="ccard-fallback" aria-hidden="true">
                <span className="v">837%</span>
                <span className="k">roas</span>
              </span>
            </span>
            {" "}
            <span className="ccard-body">
              <span className="nm">Запуск спортзалу з нуля</span>
              {" "}
              <span className="ttl">Новий спортзал вийшов на ринок з готовою маркетинговою системою.</span>
            </span>
            {" "}
            <span className="go">
              Розбір кейсу{" "}
              <span className="arr" aria-hidden="true">→</span>
            </span>
          </Link>
          {" "}
          <Link className="ccard" href="/cases/keratin">
            <span className="ccard-media">
              <Image src="/assets/img/cases/keratin/cover.jpg" alt="" width="900" height="675" sizes="(max-width: 700px) 100vw, 420px" />
              {" "}
              <span className="ccard-fallback" aria-hidden="true">
                <span className="v">929%</span>
                <span className="k">roas</span>
              </span>
            </span>
            {" "}
            <span className="ccard-body">
              <span className="nm">Майстер кератину</span>
              {" "}
              <span className="ttl">Стабільний потік записів замість нерегулярних заявок.</span>
            </span>
            {" "}
            <span className="go">
              Розбір кейсу{" "}
              <span className="arr" aria-hidden="true">→</span>
            </span>
          </Link>
        </div>
      </section>
      <section className="wrap vids-sec">
        <div className="cases-head">
          <h2 className="h2" data-split="">Клієнти — своїми словами</h2>
        </div>
        <div className="vids">
          <button className="vid-tile" type="button" data-video="/assets/video/review-1.mp4">
            <Image src="/assets/img/cases/video/review-1.jpg" alt="Відеовідгук Дарини: «Такої якості заявок раніше не було»" width="1440" height="758" />
            {" "}
            <span className="vid-time">0:37</span>
            {" "}
            <span className="vid-play" aria-hidden="true"></span>
          </button>
          {" "}
          <button className="vid-tile" type="button" data-video="/assets/video/review-2.mp4">
            <Image src="/assets/img/cases/video/review-2.jpg" alt="Відеовідгук Христини: «Мене чують, швидко реагують і все контролюють»" width="1440" height="758" />
            {" "}
            <span className="vid-time">0:44</span>
            {" "}
            <span className="vid-play" aria-hidden="true"></span>
          </button>
          {" "}
          <button className="vid-tile" type="button" data-video="/assets/video/review-3.mp4">
            <Image src="/assets/img/cases/video/review-3.jpg" alt="Відеовідгук Юлії: «За пів місяця заповнили запис на місяць вперед»" width="1440" height="758" />
            {" "}
            <span className="vid-time">1:26</span>
            {" "}
            <span className="vid-play" aria-hidden="true"></span>
          </button>
        </div>
      </section>
    </>
  );
}
