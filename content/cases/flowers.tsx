import Link from "next/link";
import Image from "next/image";

export default function CaseFlowers() {
  return (
    <>
      <header className="chero">
        <div className="chero-text">
          <span className="label">кейс 05 · маркетинг під ключ</span>
          <h1 className="chero-h">
            Мережа магазинів{" "}
            <span className="ac">квітів</span>
          </h1>
          <p className="chero-lead">Як вартість клієнта впала вшестеро — і відкрилися ще два магазини</p>
          <div className="chero-meta">
            <span>Квіти</span>
            <span>Маркетинг під ключ</span>
          </div>
          <Link href="/#contact" className="btn btn--signal btn--lg">
            Обговорити ваш проєкт
            <span className="arr" aria-hidden="true">→</span>
          </Link>
        </div>
        <figure className="chero-media">
          <Image src="/assets/img/cases/flowers/cover.jpg" alt="" width="900" height="675" sizes="(max-width: 900px) 100vw, 640px" />
          <figcaption>
            <b>4,28$</b>
            <i>
              вартість
              <br />
              клієнта
            </i>
          </figcaption>
        </figure>
      </header>
      <div className="cc-two">
        <div>
          <div className="cc-h">Про проєкт</div>
          <p>
            Мережа магазинів квітів з офлайн-точками продажу. На момент старту співпраці бізнес не мав системного маркетингу й не використовував потенціал онлайн-каналів для розвитку.
          </p>
        </div>
        <div>
          <div className="cc-h">Запит клієнта</div>
          <p>
            Побудувати комплексну маркетингову систему, яка забезпечить стабільний потік клієнтів, знизить вартість залучення та дозволить масштабувати бізнес через рекламу.
          </p>
        </div>
      </div>
      <div className="cc-block cc-block--major">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Що зробили</h2>
        </div>
        <ol className="road">
          <li className="road-step">
            <span className="road-no" aria-hidden="true">01</span>
            <h3 className="road-h">Маркетинг</h3>
            <ul className="road-list">
              <li>Розробили загальну маркетингову стратегію розвитку бізнесу</li>
              <li>Сформували позиціонування та підхід до просування</li>
              <li>Побудували систему масштабування рекламних кампаній</li>
            </ul>
          </li>
          <li className="road-step">
            <span className="road-no" aria-hidden="true">02</span>
            <h3 className="road-h">SMM</h3>
            <ul className="road-list">
              <li>Повне ведення соціальних мереж і контент-стратегія</li>
              <li>Написання текстів для постів, контент-планування та системна робота з профілем</li>
            </ul>
          </li>
          <li className="road-step">
            <span className="road-no" aria-hidden="true">03</span>
            <h3 className="road-h">Контент</h3>
            <ul className="road-list">
              <li>Сценарії для Reels та ідеї для відео-контенту</li>
              <li>Креативні концепції для залучення аудиторії</li>
            </ul>
          </li>
          <li className="road-step">
            <span className="road-no" aria-hidden="true">04</span>
            <h3 className="road-h">Таргетована реклама</h3>
            <ul className="road-list">
              <li>Налаштування й ведення кампаній, тестування аудиторій і креативів</li>
              <li>Оптимізація вартості клієнта та масштабування ефективних зв'язок</li>
            </ul>
          </li>
        </ol>
      </div>
      <div className="cc-block cc-block--card">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Дев'ять місяців: ціна переписки і клієнта</h2>
        </div>
        <div className="lcharts">
          <figure className="lchart">
            <figcaption>Ціна переписки, $</figcaption>
            <svg viewBox="0 0 560 210" role="img" aria-label="Ціна переписки, $">
              <line className="gl" x1="8" y1="176.0" x2="502" y2="176.0"></line>
              <text className="ax" x="510" y="180.0">0$</text>
              <line className="gl" x1="8" y1="103.0" x2="502" y2="103.0"></line>
              <text className="ax" x="510" y="107.0">5$</text>
              <line className="gl" x1="8" y1="30.0" x2="502" y2="30.0"></line>
              <text className="ax" x="510" y="34.0">10$</text>
              <line className="mk" x1="316.8" y1="20" x2="316.8" y2="176"></line>
              <text className="mkt" x="316.8" y="15">+ магазин</text>
              <line className="mk" x1="502.0" y1="20" x2="502.0" y2="176"></line>
              <text className="mkt mkt--end" x="502.0" y="15">+ магазин</text>
              <polyline className="ln" points="8.0,52.3 69.8,89.6 131.5,123.6 193.2,144.3 255.0,134.5 316.8,130.2 378.5,147.1 440.2,141.5 502.0,147.8"></polyline>
              <circle className="dot dot--edge" cx="8.0" cy="52.3" r="4.5">
                <title>Квітень — 8,47$</title>
              </circle>
              <text className="vl" x="8.0" y="40.3" textAnchor="start">8,47$</text>
              <circle className="dot" cx="69.8" cy="89.6" r="3">
                <title>Травень — 5,92$</title>
              </circle>
              <circle className="dot" cx="131.5" cy="123.6" r="3">
                <title>Червень — 3,59$</title>
              </circle>
              <circle className="dot" cx="193.2" cy="144.3" r="3">
                <title>Липень — 2,17$</title>
              </circle>
              <circle className="dot" cx="255.0" cy="134.5" r="3">
                <title>Серпень — 2,84$</title>
              </circle>
              <circle className="dot" cx="316.8" cy="130.2" r="3">
                <title>Вересень — 3,14$</title>
              </circle>
              <circle className="dot" cx="378.5" cy="147.1" r="3">
                <title>Жовтень — 1,98$</title>
              </circle>
              <circle className="dot" cx="440.2" cy="141.5" r="3">
                <title>Листопад — 2,36$</title>
              </circle>
              <circle className="dot dot--edge" cx="502.0" cy="147.8" r="4.5">
                <title>Грудень — 1,93$</title>
              </circle>
              <text className="vl" x="502.0" y="135.8" textAnchor="end">1,93$</text>
              <text className="ax mo" x="8.0" y="198" textAnchor="start">Квітень</text>
              <text className="ax mo mo--mid" x="131.5" y="198" textAnchor="middle">Червень</text>
              <text className="ax mo mo--mid" x="255.0" y="198" textAnchor="middle">Серпень</text>
              <text className="ax mo mo--mid" x="378.5" y="198" textAnchor="middle">Жовтень</text>
              <text className="ax mo" x="502.0" y="198" textAnchor="end">Грудень</text>
            </svg>
          </figure>
          <figure className="lchart">
            <figcaption>Вартість клієнта, $</figcaption>
            <svg viewBox="0 0 560 210" role="img" aria-label="Вартість клієнта, $">
              <line className="gl" x1="8" y1="176.0" x2="502" y2="176.0"></line>
              <text className="ax" x="510" y="180.0">0$</text>
              <line className="gl" x1="8" y1="103.0" x2="502" y2="103.0"></line>
              <text className="ax" x="510" y="107.0">15$</text>
              <line className="gl" x1="8" y1="30.0" x2="502" y2="30.0"></line>
              <text className="ax" x="510" y="34.0">30$</text>
              <line className="mk" x1="316.8" y1="20" x2="316.8" y2="176"></line>
              <text className="mkt" x="316.8" y="15">+ магазин</text>
              <line className="mk" x1="502.0" y1="20" x2="502.0" y2="176"></line>
              <text className="mkt mkt--end" x="502.0" y="15">+ магазин</text>
              <polyline className="ln" points="8.0,52.5 69.8,84.0 131.5,114.3 193.2,137.9 255.0,130.2 316.8,146.9 378.5,138.9 440.2,144.5 502.0,153.8"></polyline>
              <circle className="dot dot--edge" cx="8.0" cy="52.5" r="4.5">
                <title>Квітень — 25,38$</title>
              </circle>
              <text className="vl" x="8.0" y="40.5" textAnchor="start">25,38$</text>
              <circle className="dot" cx="69.8" cy="84.0" r="3">
                <title>Травень — 18,91$</title>
              </circle>
              <circle className="dot" cx="131.5" cy="114.3" r="3">
                <title>Червень — 12,67$</title>
              </circle>
              <circle className="dot" cx="193.2" cy="137.9" r="3">
                <title>Липень — 7,82$</title>
              </circle>
              <circle className="dot" cx="255.0" cy="130.2" r="3">
                <title>Серпень — 9,41$</title>
              </circle>
              <circle className="dot" cx="316.8" cy="146.9" r="3">
                <title>Вересень — 5,97$</title>
              </circle>
              <circle className="dot" cx="378.5" cy="138.9" r="3">
                <title>Жовтень — 7,63$</title>
              </circle>
              <circle className="dot" cx="440.2" cy="144.5" r="3">
                <title>Листопад — 6,48$</title>
              </circle>
              <circle className="dot dot--edge" cx="502.0" cy="153.8" r="4.5">
                <title>Грудень — 4,56$</title>
              </circle>
              <text className="vl" x="502.0" y="141.8" textAnchor="end">4,56$</text>
              <text className="ax mo" x="8.0" y="198" textAnchor="start">Квітень</text>
              <text className="ax mo mo--mid" x="131.5" y="198" textAnchor="middle">Червень</text>
              <text className="ax mo mo--mid" x="255.0" y="198" textAnchor="middle">Серпень</text>
              <text className="ax mo mo--mid" x="378.5" y="198" textAnchor="middle">Жовтень</text>
              <text className="ax mo" x="502.0" y="198" textAnchor="end">Грудень</text>
            </svg>
          </figure>
        </div>
      </div>
      <div className="cc-block cc-block--major">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Результат</h2>
        </div>
        <p>
          Комплексна робота з маркетингом, SMM і таргетованою рекламою збільшила онлайн-продажі та кількість звернень, підсилила впізнаваність бренду на локальному ринку й позитивно вплинула на офлайн-продажі. Зріс загальний дохід бізнесу — перший новий офлайн-магазин відкрили на 6-му місяці співпраці, другий — на 9-му. Бізнес не просто виріс у продажах, а перейшов у фазу активного розширення мережі.
        </p>
      </div>
      <div className="cc-block cc-block--major">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Скріни з рекламного кабінету</h2>
        </div>
        <div className="shots">
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/flowers/stat-1.jpg" alt="Магазин квітів: статистика рекламних кампаній" width="1400" height="375" data-full="/assets/img/cases/flowers/stat-1.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
            <figcaption>Статистика рекламних кампаній</figcaption>
          </figure>
        </div>
      </div>
      <div className="cc-block cc-block--major">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Відгуки клієнта</h2>
        </div>
        <div className="revs">
          <figure className="shot-fig">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/flowers/rev-1.jpg" alt="Відгук клієнта: відкриваємо ще один магазин, стабільний потік замовлень" width="1400" height="1246" data-full="/assets/img/cases/flowers/rev-1.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/flowers/rev-2.jpg" alt="Відгук клієнта: хочемо продовжити співпрацю, сподобався результат" width="1400" height="659" data-full="/assets/img/cases/flowers/rev-2.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
        </div>
      </div>
    </>
  );
}
