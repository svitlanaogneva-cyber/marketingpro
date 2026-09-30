import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";

export default function CaseFurniture() {
  return (
    <>
      <header className="chero">
        <div className="chero-text">
          <span className="label">кейс 01 · таргетована реклама</span>
          <h1 className="chero-h">
            Виробництво{" "}
            <span className="ac">меблів</span>
          </h1>
          <p className="chero-lead">Як реклама дала 167 продажів на місяць і окремий потік B2B-замовлень</p>
          <div className="chero-meta">
            <span>Меблі</span>
            <span>B2C + B2B</span>
            <span>5 місяців</span>
          </div>
          <Link href="/#contact" className="btn btn--signal btn--lg">
            Обговорити ваш проєкт
            <span className="arr" aria-hidden="true">→</span>
          </Link>
        </div>
        <figure className="chero-media">
          <Image src="/assets/img/cases/furniture/cover.jpg" alt="Кейс marketingpro: Виробництво меблів" width="900" height="675" sizes="(max-width: 900px) 100vw, 640px" />
          <figcaption>
            <b>167</b>
            <i>
              продажів
              <br />
              на місяць
            </i>
          </figcaption>
        </figure>
      </header>
      <div className="cc-two">
        <div>
          <div className="cc-h">Про проєкт</div>
          <p>
            Виробництво меблів, що працює одночасно в B2C та B2B сегментах. Період співпраці — 5 місяців.
          </p>
        </div>
        <div>
          <div className="cc-h">Запит клієнта</div>
          <p>Стабільний потік замовлень через рекламу та розвиток продажів у B2B-напрямі.</p>
        </div>
      </div>
      <div className="cc-block cc-block--major">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Що зробили</h2>
        </div>
        <ul className="cc-list">
          <li>Оптимізували рекламні кампанії під цільові звернення</li>
          <li>Розділили воронки для B2C та B2B сегментів</li>
          <li>Створили окремі оффери для дизайнерів і корпоративних клієнтів</li>
          <li>Протестували різні аудиторії та креативи</li>
          <li>Налаштували комунікаційні сценарії для обробки заявок</li>
          <li>Оптимізували сайт під конверсію в продажі</li>
          <li>Масштабували найефективніші зв'язки</li>
        </ul>
      </div>
      <div className="cc-block cc-block--card">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Результати останнього місяця співпраці</h2>
        </div>
        <div className="nums">
          <div>
            <b>4 845$</b>
            <span>бюджет</span>
          </div>
          <div>
            <b>1 514</b>
            <span>всього переписок</span>
          </div>
          <div>
            <b>3,2$</b>
            <span>ціна переписки</span>
          </div>
          <div>
            <b>167</b>
            <span>продажів</span>
          </div>
          <div>
            <b>29$</b>
            <span>вартість клієнта</span>
          </div>
          <div>
            <b>125 250$</b>
            <span>дохід</span>
          </div>
          <div>
            <b className="sig">2584%</b>
            <span>roas</span>
          </div>
        </div>
        <div className="chart chart--after">
          <div className="bars">
            <div className="bar-row">
              <div className="bar-name">Вклали → отримали</div>
              <div className="bar-line">
                <span className="bar-cap">бюджет</span>
                <span className="bar-track">
                  <span className="bar bar--was" style={{ "--w": "3.9%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">4 845$</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">дохід</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "100.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">125 250$</b>
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-name">З переписок — клієнти (11%)</div>
              <div className="bar-line">
                <span className="bar-cap">всього переписок</span>
                <span className="bar-track">
                  <span className="bar bar--was" style={{ "--w": "100.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">1 514</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">з них продажів</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "11.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">167</b>
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
          Системна модель залучення клієнтів через рекламу, яка стабільно генерує продажі в B2C та формує окремий потік B2B-замовлень від дизайнерів інтер'єру, оптових і корпоративних клієнтів.
        </p>
      </div>
      <div className="cc-block cc-block--major">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Скріни з рекламного кабінету</h2>
        </div>
        <div className="shots">
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/furniture/stat-1.jpg" alt="Меблі: статистика кампаній у рекламному кабінеті Meta" width="1400" height="232" data-full="/assets/img/cases/furniture/stat-1.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
            <figcaption>Статистика кампаній у рекламному кабінеті Meta</figcaption>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/furniture/stat-2.jpg" alt="Меблі: результати рекламних кампаній" width="1400" height="173" data-full="/assets/img/cases/furniture/stat-2.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
            <figcaption>Результати рекламних кампаній</figcaption>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/furniture/stat-3.jpg" alt="Меблі: розбивка по кампаніях і вартість результату" width="1400" height="275" data-full="/assets/img/cases/furniture/stat-3.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
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
          <figure className="shot-fig">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/furniture/rev-1.jpg" alt="Відгук клієнта: 43 продажі, сума 1 783 927 грн за тиждень" width="1400" height="843" data-full="/assets/img/cases/furniture/rev-1.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/furniture/rev-2.jpg" alt="Відгук клієнта: згода збільшити рекламний бюджет" width="1400" height="671" data-full="/assets/img/cases/furniture/rev-2.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/furniture/rev-3.jpg" alt="Відгук клієнта: сума замовлень за тиждень 1 296 793" width="1400" height="388" data-full="/assets/img/cases/furniture/rev-3.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
        </div>
      </div>
    </>
  );
}
