import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";

export default function CaseBags() {
  return (
    <>
      <header className="chero">
        <div className="chero-text">
          <span className="label">кейс 04 · таргетована реклама</span>
          <h1 className="chero-h">
            Онлайн-магазин жіночих{" "}
            <span className="ac">сумок</span>
          </h1>
          <p className="chero-lead">Як дохід з реклами виріс усемеро за дев'ять місяців</p>
          <div className="chero-meta">
            <span>E-commerce</span>
            <span>Сумки</span>
            <span>9 місяців</span>
          </div>
          <Link href="/#contact" className="btn btn--signal btn--lg">
            Обговорити ваш проєкт
            <span className="arr" aria-hidden="true">→</span>
          </Link>
        </div>
        <figure className="chero-media">
          <Image src="/assets/img/cases/bags/cover.jpg" alt="" width="900" height="675" sizes="(max-width: 900px) 100vw, 640px" />
          <figcaption>
            <b>×7</b>
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
            Онлайн-магазин жіночих сумок. На старті клієнт мав негативний досвід запусків таргетованої реклами: мала кількість заявок, низька конверсія в продажі, вартість клієнта 40$. Тому починали обережно — з 20$ на день. Після перших результатів бюджет поступово зростав і зараз перевищує 100$ на день.
          </p>
        </div>
        <div>
          <div className="cc-h">Запит клієнта</div>
          <p>
            Зробити таргетовану рекламу стабільним каналом продажів і забезпечити прогнозований потік клієнтів для масштабування бізнесу.
          </p>
        </div>
      </div>
      <div className="cc-block cc-block--major">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Що зробили</h2>
        </div>
        <ul className="cc-list">
          <li>Провели аудит попередніх запусків і повністю перебудували стратегію реклами</li>
          <li>Сфокусувалися на платоспроможній аудиторії з високою готовністю до покупки</li>
          <li>Тестували та масштабували креативи, аудиторії й оффери</li>
          <li>Оптимізували воронку продажів і комунікацію для підвищення конверсії</li>
          <li>Поступово збільшували бюджет відповідно до стабільних результатів</li>
          <li>
            Запустили рекламу не лише на Instagram-сторінку, а й на сайт — для розширення каналів продажів
          </li>
        </ul>
      </div>
      <div className="cc-block cc-block--card">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Перший місяць → дев'ятий</h2>
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
                <b className="bar-val">4,38$</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">стало</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "49.3%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">2,16$</b>
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-name">Вартість клієнта</div>
              <div className="bar-line">
                <span className="bar-cap">було</span>
                <span className="bar-track">
                  <span className="bar bar--was" style={{ "--w": "100.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">22,1$</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">стало</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "37.9%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">8,38$</b>
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-name">Дохід за місяць</div>
              <div className="bar-line">
                <span className="bar-cap">було</span>
                <span className="bar-track">
                  <span className="bar bar--was" style={{ "--w": "14.1%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">4 360$</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">стало</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "100.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">30 961$</b>
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-name">ROAS</div>
              <div className="bar-line">
                <span className="bar-cap">було</span>
                <span className="bar-track">
                  <span className="bar bar--was" style={{ "--w": "48.1%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">462%</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">стало</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "100.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">961%</b>
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
          За 9 місяців реклама стала стабільним джерелом продажів і в Instagram, і на сайті. Трафік почав регулярно конвертуватися в замовлення — це дало бізнесу передбачуваний потік клієнтів і зростання доходу.
        </p>
      </div>
      <div className="cc-block cc-block--major">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Скріни з рекламного кабінету</h2>
        </div>
        <div className="shots">
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/bags/stat-1.jpg" alt="Магазин сумок: підсумок по 257 кампаніях у рекламному кабінеті" width="1400" height="454" data-full="/assets/img/cases/bags/stat-1.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
            <figcaption>Підсумок по 257 кампаніях у рекламному кабінеті</figcaption>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/bags/stat-2.jpg" alt="Магазин сумок: результати кампаній, ціна за розпочату розмову" width="1400" height="381" data-full="/assets/img/cases/bags/stat-2.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
            <figcaption>Результати кампаній, ціна за розпочату розмову</figcaption>
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
              <Image src="/assets/img/cases/bags/rev-1.jpg" alt="Відгук клієнта: продовжуємо співпрацю" width="1400" height="517" data-full="/assets/img/cases/bags/rev-1.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/bags/rev-2.jpg" alt="Відгук клієнта: цей місяць був дуже класний" width="1400" height="477" data-full="/assets/img/cases/bags/rev-2.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/bags/rev-3.jpg" alt="Відгук клієнта: продовжуємо" width="1400" height="432" data-full="/assets/img/cases/bags/rev-3.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/bags/rev-4.jpg" alt="Відгук клієнта: продовжуємо співпрацю" width="1400" height="420" data-full="/assets/img/cases/bags/rev-4.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/bags/rev-5.jpg" alt="Відгук клієнта: так, продовжуємо" width="1400" height="526" data-full="/assets/img/cases/bags/rev-5.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/bags/rev-6.jpg" alt="Відгук клієнта: продовжуємо співпрацю наступного місяця" width="1400" height="510" data-full="/assets/img/cases/bags/rev-6.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/bags/rev-7.jpg" alt="Відгук клієнта: продовжуємо звичайно" width="1400" height="648" data-full="/assets/img/cases/bags/rev-7.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/bags/rev-8.jpg" alt="Відгук клієнта: продовжуємо співпрацю" width="1400" height="357" data-full="/assets/img/cases/bags/rev-8.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
        </div>
      </div>
    </>
  );
}
