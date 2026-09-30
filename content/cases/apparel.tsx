import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";

export default function CaseApparel() {
  return (
    <>
      <header className="chero">
        <div className="chero-text">
          <span className="label">кейс 02 · таргетована реклама</span>
          <h1 className="chero-h">
            Український бренд одягу з власним{" "}
            <span className="ac">виробництвом</span>
          </h1>
          <p className="chero-lead">10× зростання доходу з реклами за рік роботи</p>
          <div className="chero-meta">
            <span>Одяг</span>
            <span>Виробництво</span>
            <span>12 місяців</span>
          </div>
          <Link href="/#contact" className="btn btn--signal btn--lg">
            Обговорити ваш проєкт
            <span className="arr" aria-hidden="true">→</span>
          </Link>
        </div>
        <figure className="chero-media">
          <Image src="/assets/img/cases/apparel/cover.jpg" alt="Кейс marketingpro: Український бренд одягу з власним виробництвом" width="900" height="675" sizes="(max-width: 900px) 100vw, 640px" />
          <figcaption>
            <b>×10</b>
            <i>
              дохід
              <br />
              з реклами
            </i>
          </figcaption>
        </figure>
      </header>
      <div className="cc-two">
        <div>
          <div className="cc-h">Про проєкт</div>
          <p>
            Український бренд одягу з власним виробництвом, який поєднує розробку, пошиття та продаж продукції під власною торговою маркою.
          </p>
        </div>
        <div>
          <div className="cc-h">Запит клієнта</div>
          <p>
            Стабілізувати продажі через рекламу, знизити вартість залучення клієнта та побудувати прогнозовану систему масштабування.
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
            <h3 className="road-h">Побудова рекламної системи</h3>
            <ul className="road-list">
              <li>Розробили структуру рекламних кампаній під продажі в Direct та на сайт</li>
              <li>Побудували воронку «реклама → переписка → продаж»</li>
              <li>Налаштували систему стабільного масштабування рекламного бюджету</li>
            </ul>
          </li>
          <li className="road-step">
            <span className="road-no" aria-hidden="true">02</span>
            <h3 className="road-h">Оптимізація реклами</h3>
            <ul className="road-list">
              <li>Протестували різні креативи, аудиторії та оффери</li>
              <li>Масштабували найефективніші рекламні зв'язки</li>
              <li>Знизили вартість переписки та підвищили конверсію в покупку</li>
            </ul>
          </li>
          <li className="road-step">
            <span className="road-no" aria-hidden="true">03</span>
            <h3 className="road-h">Масштабування</h3>
            <ul className="road-list">
              <li>Оптимізували кампанії під стабільний ріст</li>
              <li>Побудували прогнозовану модель, яка дозволяє збільшувати бюджет без втрати ефективності</li>
            </ul>
          </li>
        </ol>
      </div>
      <div className="cc-block cc-block--card">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Перший місяць → дванадцятий</h2>
        </div>
        <div className="chart">
          <div className="bars">
            <div className="bar-row">
              <div className="bar-name">Ціна переписки</div>
              <div className="bar-line">
                <span className="bar-cap">було</span>
                <span className="bar-track">
                  <span className="bar bar--was" style={{ "--w": "100.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">4,23$</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">стало</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "43.5%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">1,84$</b>
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-name">Вартість клієнта</div>
              <div className="bar-line">
                <span className="bar-cap">було</span>
                <span className="bar-track">
                  <span className="bar bar--was" style={{ "--w": "100.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">18,14$</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">стало</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "48.2%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">8,75$</b>
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-name">Дохід за місяць</div>
              <div className="bar-line">
                <span className="bar-cap">було</span>
                <span className="bar-track">
                  <span className="bar bar--was" style={{ "--w": "9.9%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">2 903$</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">стало</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "100.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">29 365$</b>
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-name">ROAS</div>
              <div className="bar-line">
                <span className="bar-cap">було</span>
                <span className="bar-track">
                  <span className="bar bar--was" style={{ "--w": "26.6%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">314%</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">стало</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "100.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">1 182%</b>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cc-block cc-block--major">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Результат</h2>
        </div>
        <p>
          За 12 місяців співпраці реклама перетворилася з нестабільного інструменту на стабільний канал продажів із постійним масштабуванням результату.
        </p>
      </div>
      <div className="cc-block cc-block--major">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Скріни з рекламного кабінету</h2>
        </div>
        <div className="shots">
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/apparel/stat-1.jpg" alt="Бренд одягу: статистика кампаній у рекламному кабінеті" width="1400" height="261" data-full="/assets/img/cases/apparel/stat-1.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
            <figcaption>Статистика кампаній у рекламному кабінеті</figcaption>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/apparel/stat-2.jpg" alt="Бренд одягу: розбивка по кампаніях і вартість результату" width="1400" height="176" data-full="/assets/img/cases/apparel/stat-2.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
            <figcaption>Розбивка по кампаніях і вартість результату</figcaption>
          </figure>
        </div>
      </div>
      <div className="cc-block cc-block--major">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Відгуки клієнта</h2>
        </div>
        <div className="revs">
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/apparel/rev-1.jpg" alt="Відгук клієнта: замовлень із сайту стало набагато більше" width="1400" height="448" data-full="/assets/img/cases/apparel/rev-1.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/apparel/rev-2.jpg" alt="Відгук клієнта: задоволена результатами, продовжуємо співпрацю" width="1400" height="516" data-full="/assets/img/cases/apparel/rev-2.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/apparel/rev-3.jpg" alt="Відгук клієнта: потік замовлень помітно виріс" width="1400" height="347" data-full="/assets/img/cases/apparel/rev-3.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
        </div>
      </div>
    </>
  );
}
