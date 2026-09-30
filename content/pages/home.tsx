import Link from "next/link";
import Image from "next/image";
import { FAQ } from "@/content/faq";

export default function Home() {
  return (
    <>
      <section className="hero hero--card">
        <div className="hero-card fade">
          <div className="hero-photo" aria-hidden="true">
            <Image src="/assets/img/hero-bg.jpg" alt="" width="2000" height="1500" sizes="100vw" priority />
          </div>
          <div className="label-group">
            <span className="label">Таргет</span>
            {" "}
            <span className="label">Маркетинг</span>
            {" "}
            <span className="label">SMM</span>
            {" "}
            <span className="label">Навчання</span>
          </div>
          <div className="hero-card-in">
            <h1 className="display" data-split="" data-split-delay="0.15">
              Допомагаємо бізнесу{" "}
              <span className="ln2">заробляти більше</span>
            </h1>
            <p className="lead">
              Працюємо з різними бюджетами. Розробляємо індивідуальну стратегію під ваш бізнес. Працюємо лише на результат.
            </p>
            <div className="hero-cta">
              <a href="#contact" className="btn btn--signal btn--lg">
                Безкоштовна консультація
                <span className="arr" aria-hidden="true">→</span>
              </a>
              {" "}
              <Link href="/cases" className="btn btn--ghost btn--lg">Кейси</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="pain section" id="pain">
        <div className="wrap">
          <h2 className="h2" data-split="">Реклама запущена. Продажі не ростуть.</h2>
          <div className="pain-list">
            <div className="pain-row">
              <span className="no">01</span>
              <div>
                <h3>Заявки є — покупців немає</h3>
                <p>
                  Люди пишуть, питають ціну — і зникають. Ваші менеджери витрачають час, а реальних покупців — одиниці.
                </p>
              </div>
            </div>
            <div className="pain-row">
              <span className="no">02</span>
              <div>
                <h3>Бюджет росте швидше за результат</h3>
                <p>
                  Коли витрати на рекламу зростають, заявки стають дорожчими, а продажі не ростуть так само швидко. У результаті реклама приносить менше прибутку.
                </p>
              </div>
            </div>
            <div className="pain-row">
              <span className="no">03</span>
              <div>
                <h3>Агенція годує вас звітами про «охоплення»</h3>
                <p>
                  У звітах є кліки, охоплення та CTR, але продажі від цього не ростуть. Ви отримуєте багато цифр, але не розумієте, що реклама реально дає бізнесу.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section wrap" id="services">
        <div className="svc-layout">
          <div className="svc-head">
            <h2 className="h2" data-split="">Спектр наших рішень</h2>
            <p className="svc-lead">
              Фокусуємося на тому, що реально приносить прибуток — без зайвих інструментів і складних налаштувань.
            </p>
          </div>
          <div className="svc-accordion">
            <div className="svc-col">
              <div className="svc-item">
                <button className="svc-row" aria-expanded="false">
                  <span className="no">01</span>
                  <span className="nm">Повний супровід бізнесу</span>
                  <span className="qa-ic" aria-hidden="true"></span>
                </button>
                <div className="svc-desc">
                  <span>
                    <span className="svc-desc-inner">
                      Комплексне маркетингове рішення для розвитку та масштабування вашого бізнесу. Ми беремо на себе стратегічне планування, рекламу, контент, аналітику та оптимізацію всіх маркетингових процесів для досягнення стабільного зростання.
                    </span>
                  </span>
                </div>
              </div>
              <div className="svc-item">
                <button className="svc-row" aria-expanded="false">
                  <span className="no">02</span>
                  <span className="nm">Маркетингова стратегія</span>
                  <span className="qa-ic" aria-hidden="true"></span>
                </button>
                <div className="svc-desc">
                  <span>
                    <span className="svc-desc-inner">
                      Створюємо індивідуальну маркетингову стратегію на основі аналізу ринку, конкурентів та цільової аудиторії. Визначаємо ефективні канали залучення клієнтів і розробляємо покроковий план розвитку бізнесу.
                    </span>
                  </span>
                </div>
              </div>
              <div className="svc-item">
                <button className="svc-row" aria-expanded="false">
                  <span className="no">03</span>
                  <span className="nm">Meta Ads</span>
                  <span className="qa-ic" aria-hidden="true"></span>
                </button>
                <div className="svc-desc">
                  <span>
                    <span className="svc-desc-inner">
                      Налаштовуємо та оптимізуємо рекламні кампанії у Facebook та Instagram для залучення нових клієнтів і збільшення продажів. Працюємо з різними цілями: ліди, заявки, продажі, впізнаваність бренду.
                    </span>
                  </span>
                </div>
              </div>
              <div className="svc-item">
                <button className="svc-row" aria-expanded="false">
                  <span className="no">04</span>
                  <span className="nm">SMM та контент-маркетинг</span>
                  <span className="qa-ic" aria-hidden="true"></span>
                </button>
                <div className="svc-desc">
                  <span>
                    <span className="svc-desc-inner">
                      Розробляємо контент-стратегію та створюємо контент, який залучає аудиторію та формує довіру до бренду. Допомагаємо перетворювати аудиторію у потенційних клієнтів.
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="svc-col">
              <div className="svc-item">
                <button className="svc-row" aria-expanded="false">
                  <span className="no">05</span>
                  <span className="nm">Аудит бізнесу та маркетингу</span>
                  <span className="qa-ic" aria-hidden="true"></span>
                </button>
                <div className="svc-desc">
                  <span>
                    <span className="svc-desc-inner">
                      Знайдемо причини, через які бізнес втрачає клієнтів та гроші на рекламі. Проводимо комплексний аналіз маркетингових процесів, рекламних кампаній та позиціонування бізнесу. Виявляємо точки росту, помилки та надаємо чіткі рекомендації для підвищення результатів.
                    </span>
                  </span>
                </div>
              </div>
              <div className="svc-item">
                <button className="svc-row" aria-expanded="false">
                  <span className="no">06</span>
                  <span className="nm">Розробка сайтів і лендінгів</span>
                  <span className="qa-ic" aria-hidden="true"></span>
                </button>
                <div className="svc-desc">
                  <span>
                    <span className="svc-desc-inner">
                      Створюємо сучасні сайти та лендінги, орієнтовані на конверсію та продажі. Розробляємо структуру, дизайн і користувацький шлях для максимальної ефективності кожної сторінки.
                    </span>
                  </span>
                </div>
              </div>
              <div className="svc-item">
                <button className="svc-row" aria-expanded="false">
                  <span className="no">07</span>
                  <span className="nm">Індивідуальне наставництво</span>
                  <span className="qa-ic" aria-hidden="true"></span>
                </button>
                <div className="svc-desc">
                  <span>
                    <span className="svc-desc-inner">
                      Персональний супровід для підприємців і спеціалістів, які хочуть розвиватися у SMM, таргеті, контенті та digital-маркетингу і масштабувати свої результати. Формат включає відео-уроки, особисті онлайн-зустрічі та практичний розбір ваших задач з підтримкою на кожному етапі впровадження.
                    </span>
                  </span>
                </div>
              </div>
              <div className="svc-item">
                <button className="svc-row" aria-expanded="false">
                  <span className="no">08</span>
                  <span className="nm">Стратегічна бізнес-консультація</span>
                  <span className="qa-ic" aria-hidden="true"></span>
                </button>
                <div className="svc-desc">
                  <span>
                    <span className="svc-desc-inner">
                      Глибокий аналіз поточної ситуації бізнесу та пошук можливостей для розвитку. Допомагаємо визначити пріоритети, знайти нові точки росту, побудувати ефективну стратегію залучення клієнтів та масштабування проєкту.
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section wrap" id="cases">
        <div className="cases-head">
          <h2 className="h2" data-split="">Кейси, за якими нас памʼятають</h2>
          <Link href="/cases" className="btn btn--ghost">
            Усі кейси{" "}
            <span className="arr" aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="gal gal--cases" data-nav-label="кейс">
          <div className="gal-track" tabIndex={0} role="group" aria-label="Кейси агенції">
            <Link className="ccard" href="/cases/furniture?from=home">
              <span className="ccard-media">
                <Image src="/assets/img/cases/furniture/cover.jpg" alt="Кейс marketingpro: Виробництво меблів" width="900" height="675" sizes="(max-width: 700px) 100vw, 420px" />
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
                <span className="ttl">167 продажів на місяць і окремий потік B2B-замовлень від дизайнерів</span>
              </span>
              {" "}
              <span className="go">
                Розбір кейсу{" "}
                <span className="arr" aria-hidden="true">→</span>
              </span>
            </Link>
            {" "}
            <Link className="ccard" href="/cases/apparel?from=home">
              <span className="ccard-media">
                <Image src="/assets/img/cases/apparel/cover.jpg" alt="Кейс marketingpro: Український бренд одягу з власним виробництвом" width="900" height="675" sizes="(max-width: 700px) 100vw, 420px" />
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
                <span className="ttl">Дохід з реклами виріс удесятеро за рік роботи</span>
              </span>
              {" "}
              <span className="go">
                Розбір кейсу{" "}
                <span className="arr" aria-hidden="true">→</span>
              </span>
            </Link>
            {" "}
            <Link className="ccard" href="/cases/language?from=home">
              <span className="ccard-media">
                <Image src="/assets/img/cases/language/cover.jpg" alt="Кейс marketingpro: Школа іноземних мов" width="900" height="675" sizes="(max-width: 700px) 100vw, 420px" />
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
                <span className="ttl">137 нових учнів на місяць — групи заповнюються рівномірно</span>
              </span>
              {" "}
              <span className="go">
                Розбір кейсу{" "}
                <span className="arr" aria-hidden="true">→</span>
              </span>
            </Link>
            {" "}
            <Link className="ccard" href="/cases/bags?from=home">
              <span className="ccard-media">
                <Image src="/assets/img/cases/bags/cover.jpg" alt="Кейс marketingpro: Онлайн-магазин жіночих сумок" width="900" height="675" sizes="(max-width: 700px) 100vw, 420px" />
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
                <span className="ttl">Дохід з реклами ×7 за дев'ять місяців</span>
              </span>
              {" "}
              <span className="go">
                Розбір кейсу{" "}
                <span className="arr" aria-hidden="true">→</span>
              </span>
            </Link>
            {" "}
            <Link className="ccard" href="/cases/flowers?from=home">
              <span className="ccard-media">
                <Image src="/assets/img/cases/flowers/cover.jpg" alt="Кейс marketingpro: Мережа магазинів квітів" width="900" height="675" sizes="(max-width: 700px) 100vw, 420px" />
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
                <span className="ttl">Вартість клієнта впала в шість разів — відкрили ще два магазини</span>
              </span>
              {" "}
              <span className="go">
                Розбір кейсу{" "}
                <span className="arr" aria-hidden="true">→</span>
              </span>
            </Link>
            {" "}
            <Link className="ccard" href="/cases/dental?from=home">
              <span className="ccard-media">
                <Image src="/assets/img/cases/dental/cover.jpg" alt="Кейс marketingpro: Стоматологічна клініка" width="900" height="675" sizes="(max-width: 700px) 100vw, 420px" />
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
                <span className="ttl">За два місяці дохід клініки з реклами зріс утричі</span>
              </span>
              {" "}
              <span className="go">
                Розбір кейсу{" "}
                <span className="arr" aria-hidden="true">→</span>
              </span>
            </Link>
            {" "}
            <Link className="ccard" href="/cases/beauty?from=home">
              <span className="ccard-media">
                <Image src="/assets/img/cases/beauty/cover.jpg" alt="Кейс marketingpro: Студія краси повного циклу" width="900" height="675" sizes="(max-width: 700px) 100vw, 420px" />
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
                <span className="ttl">Графік майстрів заповнений без «порожніх» днів</span>
              </span>
              {" "}
              <span className="go">
                Розбір кейсу{" "}
                <span className="arr" aria-hidden="true">→</span>
              </span>
            </Link>
            {" "}
            <Link className="ccard" href="/cases/gym?from=home">
              <span className="ccard-media">
                <Image src="/assets/img/cases/gym/cover.jpg" alt="Кейс marketingpro: Запуск спортзалу з нуля" width="900" height="675" sizes="(max-width: 700px) 100vw, 420px" />
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
                <span className="ttl">Новий спортзал вийшов на ринок з готовою маркетинговою системою</span>
              </span>
              {" "}
              <span className="go">
                Розбір кейсу{" "}
                <span className="arr" aria-hidden="true">→</span>
              </span>
            </Link>
            {" "}
            <Link className="ccard" href="/cases/keratin?from=home">
              <span className="ccard-media">
                <Image src="/assets/img/cases/keratin/cover.jpg" alt="Кейс marketingpro: Майстер кератину" width="900" height="675" sizes="(max-width: 700px) 100vw, 420px" />
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
                <span className="ttl">Стабільний потік записів замість нерегулярних заявок</span>
              </span>
              {" "}
              <span className="go">
                Розбір кейсу{" "}
                <span className="arr" aria-hidden="true">→</span>
              </span>
            </Link>
          </div>
        </div>
      </section>
      <section className="quote-sec section" id="reviews">
        <div className="wrap">
          <blockquote>
            «До цього дві агенції просто зливали бюджет, а нормального результату не було. Тут нарешті все стало зрозуміло: є стратегія, є цифри, і є результат. Уже на другий місяць ROAS був{" "}
            <span className="sig">понад 600%</span>
            .»
          </blockquote>
          <div className="by">
            <span className="ava media">
              <Image src="/assets/img/rev3.jpg" width="240" height="240" alt="Дмитро, власник інтернет-магазину одягу" />
            </span>
            <div className="who">
              <b>Дмитро Р.</b>
              {" "}
              <span>· власник інтернет-магазину одягу</span>
            </div>
          </div>
          <div className="tst-more">
            <figure className="tst2">
              <span className="ava media">
                <Image src="/assets/img/rev1.jpg" width="240" height="240" alt="Олена, власниця бьюті-студії" />
              </span>
              <div>
                <p className="q">
                  «Нарешті не треба гадати, чи працює реклама. Щодня бачу, скільки витратили і скільки отримали заявок. За місяць записів стало вдвічі більше.»
                </p>
                <div className="who">
                  Олена К.{" "}
                  <span>· власниця бьюті-студії</span>
                </div>
              </div>
            </figure>
            <figure className="tst2">
              <span className="ava media">
                <Image src="/assets/img/rev2.jpg" width="240" height="240" alt="Ірина, студія масажу" />
              </span>
              <div>
                <p className="q">
                  «Усе пояснюють простими словами, без зайвих складних термінів. Я нарешті розумію, за що плачу, куди йдуть мої гроші і що насправді приводить мені клієнтів.»
                </p>
                <div className="who">
                  Ірина М.{" "}
                  <span>· студія масажу</span>
                </div>
              </div>
            </figure>
          </div>
        </div>
      </section>
      <section className="section wrap" id="founder">
        <div className="founder-grid">
          <div className="founder-photo">
            <div className="media">
              <Image src="/assets/img/founder.jpg" width="547" height="740" alt="Світлана Ліщишина, засновниця агенції" />
            </div>
            <div className="founder-name">
              <strong>Світлана Ліщишина</strong>
              {" "}
              <span>засновниця агенції</span>
            </div>
          </div>
          <div className="founder-txt">
            <h2 className="h2" data-split="">
              Маркетинг, у якому видно кожну{" "}
              <span className="sig">гривню</span>
            </h2>
            <p>
              Ми — маркетингова агенція, яка допомагає бізнесу залучати клієнтів через ефективні рекламні стратегії, контент і цифрові канали. Наша мета — не просто збільшити охоплення, а створити систему, яка приносить прибуток.
            </p>
            <div className="founder-facts">
              <div className="fact">
                <div className="n">
                  500
                  <span className="sig">+</span>
                </div>
                <div className="t">реалізованих проєктів</div>
              </div>
              <div className="fact">
                <div className="n">
                  15
                  <span className="sig">+</span>
                </div>
                <div className="t">країн співпраці</div>
              </div>
              <div className="fact">
                <div className="n">
                  20
                  <span className="sig">+</span>
                </div>
                <div className="t">спеціалістів у команді</div>
              </div>
              <div className="fact">
                <div className="n">
                  430
                  <span className="sig">%</span>
                </div>
                <div className="t">середній ROAS</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="wrap">
        <div className="academy" id="academy">
          <Image className="academy-ava" src="/assets/img/academy.jpg" width="800" height="800" alt="Ноутбук і блокнот на столі" />
          <div className="academy-txt">
            <h3>Академія таргетованої реклами</h3>
            <p>
              Навчіться запускати рекламу, що приносить результат. Для власників бізнесу, таргетологів і спеціалістів, які хочуть опанувати таргетовану рекламу з нуля, підвищити кваліфікацію, покращити результати та стабільно залучати клієнтів.
            </p>
          </div>
          <Link href="/academy" className="btn btn--ghost">
            Програми навчання{" "}
            <span className="arr" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
      <section className="section wrap" id="faq">
        <div className="faq-layout">
          <div className="faq-aside">
            <h2 className="h2" data-split="">Часті запитання</h2>
          </div>
          <div className="faq-list">
            {FAQ.map((item) => (
              <div className="qa" key={item.q}>
                <button className="qa-q" type="button" aria-expanded="false">
                  <h3>{item.q}</h3>
                  <span className="qa-ic" aria-hidden="true"></span>
                </button>
                <div className="qa-a">
                  <div>
                    {item.a.map((t) => (
                      <p key={t}>{t}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
