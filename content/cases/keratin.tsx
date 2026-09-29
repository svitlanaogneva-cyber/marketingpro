import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";

export default function CaseKeratin() {
  return (
    <>
      <header className="chero">
        <div className="chero-text">
          <span className="label">кейс 09 · таргетована реклама</span>
          <h1 className="chero-h">
            Майстер{" "}
            <span className="ac">кератину</span>
          </h1>
          <p className="chero-lead">Стабільний потік записів замість нерегулярних заявок</p>
          <div className="chero-meta">
            <span>Б'юті</span>
            <span>Приватний майстер</span>
          </div>
          <Link href="/#contact" className="btn btn--signal btn--lg">
            Обговорити ваш проєкт
            <span className="arr" aria-hidden="true">→</span>
          </Link>
        </div>
        <figure className="chero-media">
          <Image src="/assets/img/cases/keratin/cover.jpg" alt="" width="900" height="675" sizes="(max-width: 900px) 100vw, 640px" />
          <figcaption>
            <b>50</b>
            <i>
              клієнтів
              <br />
              за місяць
            </i>
          </figcaption>
        </figure>
      </header>
      <div className="cc-two">
        <div>
          <div className="cc-h">Про проєкт</div>
          <p>Б'юті-майстер, який спеціалізується на кератинових процедурах.</p>
        </div>
        <div>
          <div className="cc-h">Запит клієнта</div>
          <p>
            Налагодити системне залучення клієнтів через таргетовану рекламу та забезпечити прогнозовану кількість записів щомісяця — замість нерегулярних заявок.
          </p>
        </div>
      </div>
      <div className="cc-block cc-block--major">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Що зробили</h2>
        </div>
        <ul className="cc-list">
          <li>
            Налаштували рекламу на локальну аудиторію, зацікавлену в б'юті-послугах і догляді за волоссям
          </li>
          <li>
            Розробили структуру комунікації в Direct — чіткий шлях клієнта від першого звернення до запису
          </li>
          <li>Оптимізували воронку запису через переписку для підвищення конверсії</li>
          <li>
            Посилили візуальне позиціонування майстра через контент і демонстрацію реальних результатів роботи
          </li>
        </ul>
      </div>
      <div className="cc-block cc-block--card">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Результати одного місяця співпраці</h2>
        </div>
        <div className="nums">
          <div>
            <b>374$</b>
            <span>бюджет</span>
          </div>
          <div>
            <b>311</b>
            <span>всього переписок</span>
          </div>
          <div>
            <b>1,2$</b>
            <span>ціна переписки</span>
          </div>
          <div>
            <b>50</b>
            <span>клієнтів</span>
          </div>
          <div>
            <b>7,4$</b>
            <span>вартість клієнта</span>
          </div>
          <div>
            <b>3 475$</b>
            <span>дохід</span>
          </div>
          <div>
            <b className="sig">929%</b>
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
                  <span className="bar bar--was" style={{ "--w": "10.8%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">374$</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">дохід</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "100.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">3 475$</b>
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-name">З переписок — клієнти (16%)</div>
              <div className="bar-line">
                <span className="bar-cap">всього переписок</span>
                <span className="bar-track">
                  <span className="bar bar--was" style={{ "--w": "100.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">311</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">з них клієнтів</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "16.1%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">50</b>
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
          Сформовано стабільну систему залучення клієнтів через рекламу з регулярним потоком заявок. Вибудувано передбачувану воронку записів, де кожен етап взаємодії логічно веде до запису на процедуру. Підвищено якість звернень і конверсію з переписки в запис. Майстер отримав стабільне джерело нових клієнтів без повної залежності від рекомендацій.
        </p>
      </div>
      <div className="cc-block cc-block--major">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Скріни з рекламного кабінету</h2>
        </div>
        <div className="shots">
          <figure className="shot-fig">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/keratin/stat-1.jpg" alt="Майстер кератину: активні кампанії й ціна за розпочату розмову" width="1245" height="1400" data-full="/assets/img/cases/keratin/stat-1.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
            <figcaption>Активні кампанії й ціна за розпочату розмову</figcaption>
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
              <Image src="/assets/img/cases/keratin/rev-1.jpg" alt="Відгук клієнта: вчора було 4 клієнта, сьогодні ще 3" width="1400" height="442" data-full="/assets/img/cases/keratin/rev-1.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/keratin/rev-2.jpg" alt="Відгук клієнта: розклад записів на найближчі дні" width="1400" height="420" data-full="/assets/img/cases/keratin/rev-2.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/keratin/rev-3.jpg" alt="Відгук клієнта: на цей тиждень запис повністю заповнений" width="1400" height="260" data-full="/assets/img/cases/keratin/rev-3.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
        </div>
      </div>
    </>
  );
}
