import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";

export default function CaseDental() {
  return (
    <>
      <header className="chero">
        <div className="chero-text">
          <span className="label">кейс 06 · таргетована реклама</span>
          <h1 className="chero-h">
            Стоматологічна{" "}
            <span className="ac">клініка</span>
          </h1>
          <p className="chero-lead">Як за два місяці дохід клініки з реклами зріс утричі</p>
          <div className="chero-meta">
            <span>Медицина</span>
            <span>Стоматологія</span>
            <span>2 місяці</span>
          </div>
          <Link href="/#contact" className="btn btn--signal btn--lg">
            Обговорити ваш проєкт
            <span className="arr" aria-hidden="true">→</span>
          </Link>
        </div>
        <figure className="chero-media">
          <Image src="/assets/img/cases/dental/cover.jpg" alt="Кейс marketingpro: Стоматологічна клініка" width="900" height="675" sizes="(max-width: 900px) 100vw, 640px" />
          <figcaption>
            <b>×3</b>
            <i>
              дохід
              <br />
              за два місяці
            </i>
          </figcaption>
        </figure>
      </header>
      <div className="cc-two">
        <div>
          <div className="cc-h">Про проєкт</div>
          <p>
            Сучасна стоматологічна клініка, що надає повний спектр послуг — від профілактики та гігієни до складного лікування й естетичної стоматології.
          </p>
        </div>
        <div>
          <div className="cc-h">Запит клієнта</div>
          <p>
            Підвищити конверсію з рекламних звернень у реальні записи та зменшити втрати потенційних пацієнтів на етапі комунікації.
          </p>
        </div>
      </div>
      <div className="cc-block cc-block--major">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Що зробили</h2>
        </div>
        <ul className="cc-list">
          <li>
            Повністю переглянули підхід до залучення та обробки пацієнтів — фокус не на кількості звернень, а на їх якості та конверсії в запис
          </li>
          <li>
            Перебудували креативи: акцент на реальних лікарях, процесі лікування та результатах — це підвищило довіру ще на етапі першого контакту
          </li>
          <li>
            Оптимізували структуру офферів, перевівши фокус на прості точки входу: консультації, гігієна, первинні огляди
          </li>
          <li>
            Оновили скрипти комунікації — прибрали шаблонність і вибудували логічний шлях діалогу до запису на прийом
          </li>
        </ul>
      </div>
      <div className="cc-block cc-block--card">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Що змінилося за два місяці</h2>
        </div>
        <div className="chart">
          <div className="bars">
            <div className="bar-row">
              <div className="bar-name">Ціна переписки</div>
              <div className="bar-line">
                <span className="bar-cap">до співпраці</span>
                <span className="bar-track">
                  <span className="bar bar--was" style={{ "--w": "100.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">6,5$</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">стало</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "80.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">5,2$</b>
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-name">Вартість пацієнта</div>
              <div className="bar-line">
                <span className="bar-cap">до співпраці</span>
                <span className="bar-track">
                  <span className="bar bar--was" style={{ "--w": "100.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">40,76$</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">стало</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "67.5%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">27,5$</b>
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-name">Дохід за місяць</div>
              <div className="bar-line">
                <span className="bar-cap">до співпраці</span>
                <span className="bar-track">
                  <span className="bar bar--was" style={{ "--w": "33.7%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">7 362$</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">стало</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "100.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">21 875$</b>
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-name">ROAS</div>
              <div className="bar-line">
                <span className="bar-cap">до співпраці</span>
                <span className="bar-track">
                  <span className="bar bar--was" style={{ "--w": "83.2%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">723%</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">стало</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "100.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">869%</b>
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
          За 2 місяці роботи вдалося кардинально підвищити ефективність рекламної системи та конверсію зі звернення в реальний запис. Кількість пацієнтів, які доходять до візиту, зросла, а потік записів став стабільним і передбачуваним. Зміни в креативах, офферах і комунікації знизили втрати лідів на етапі обробки.
        </p>
      </div>
      <div className="cc-block cc-block--major">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Скріни з рекламного кабінету</h2>
        </div>
        <div className="shots">
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/dental/stat-1.jpg" alt="Стоматологія: статистика кампаній у рекламному кабінеті" width="1400" height="308" data-full="/assets/img/cases/dental/stat-1.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
            <figcaption>Статистика кампаній у рекламному кабінеті</figcaption>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/dental/stat-2.jpg" alt="Стоматологія: результати кампаній і вартість результату" width="1400" height="241" data-full="/assets/img/cases/dental/stat-2.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
            <figcaption>Результати кампаній і вартість результату</figcaption>
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
              <Image src="/assets/img/cases/dental/rev-1.jpg" alt="Відгук клієнта: 20 нових клієнтів, сума 5 192$" width="1400" height="358" data-full="/assets/img/cases/dental/rev-1.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/dental/rev-2.jpg" alt="Відгук клієнта: приємно здивовані, наскільки знизилась вартість клієнта" width="1400" height="548" data-full="/assets/img/cases/dental/rev-2.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/dental/rev-3.jpg" alt="Відгук клієнта: за минулий тиждень 17 нових клієнтів, сума 3 467$" width="1400" height="331" data-full="/assets/img/cases/dental/rev-3.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
        </div>
      </div>
    </>
  );
}
