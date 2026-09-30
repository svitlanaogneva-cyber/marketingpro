import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";

export default function CaseLanguage() {
  return (
    <>
      <header className="chero">
        <div className="chero-text">
          <span className="label">кейс 03 · таргетована реклама</span>
          <h1 className="chero-h">
            Школа іноземних{" "}
            <span className="ac">мов</span>
          </h1>
          <p className="chero-lead">Як системна реклама дала 137 нових учнів за місяць</p>
          <div className="chero-meta">
            <span>Освіта</span>
            <span>Набір груп</span>
            <span>5 місяців</span>
          </div>
          <Link href="/#contact" className="btn btn--signal btn--lg">
            Обговорити ваш проєкт
            <span className="arr" aria-hidden="true">→</span>
          </Link>
        </div>
        <figure className="chero-media">
          <Image src="/assets/img/cases/language/cover.jpg" alt="Кейс marketingpro: Школа іноземних мов" width="900" height="675" sizes="(max-width: 900px) 100vw, 640px" />
          <figcaption>
            <b>137</b>
            <i>
              нових учнів
              <br />
              за місяць
            </i>
          </figcaption>
        </figure>
      </header>
      <div className="cc-two">
        <div>
          <div className="cc-h">Про проєкт</div>
          <p>
            Школа іноземних мов із діючими групами та стабільним рівнем викладання, яка стикалась із нерівномірним набором учнів і нестачею нових заявок. Частина груп заповнювалась повільно, а навантаження на викладачів було складно прогнозувати.
          </p>
        </div>
        <div>
          <div className="cc-h">Запит клієнта</div>
          <p>
            Забезпечити стабільний потік нових учнів через рекламу, підвищити впізнаваність школи на ринку та створити умови для масштабування бізнесу.
          </p>
        </div>
      </div>
      <div className="cc-block cc-block--major">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Що зробили</h2>
        </div>
        <ul className="cc-list">
          <li>Запустили рекламу на повідомлення в Instagram</li>
          <li>Протестували різні аудиторії: дорослі, студенти, батьки школярів</li>
          <li>
            Розділили кампанії під різні рівні навчання — A1–B2, розмовні клуби, індивідуальні заняття
          </li>
          <li>Оптимізували воронку переходу в Direct та месенджери</li>
          <li>Допомогли закрити потребу в нових викладачах під збільшення кількості учнів</li>
          <li>Забезпечили рівномірне заповнення груп протягом року, а не лише в пікові періоди набору</li>
        </ul>
      </div>
      <div className="cc-block cc-block--card">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Результати одного місяця співпраці</h2>
        </div>
        <div className="nums">
          <div>
            <b>1 947$</b>
            <span>бюджет</span>
          </div>
          <div>
            <b>708</b>
            <span>повідомлень</span>
          </div>
          <div>
            <b>2,75$</b>
            <span>повідомлення</span>
          </div>
          <div>
            <b>137</b>
            <span>нових учнів</span>
          </div>
          <div>
            <b>14,2$</b>
            <span>учень</span>
          </div>
          <div>
            <b>22 741$</b>
            <span>дохід</span>
          </div>
          <div>
            <b className="sig">1168%</b>
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
                  <span className="bar bar--was" style={{ "--w": "8.6%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">1 947$</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">дохід</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "100.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">22 741$</b>
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-name">З переписок — клієнти (19%)</div>
              <div className="bar-line">
                <span className="bar-cap">всього переписок</span>
                <span className="bar-track">
                  <span className="bar bar--was" style={{ "--w": "100.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">708</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">з них учнів</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "19.4%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">137</b>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cc-two cc-two--blocks">
        <div className="cc-block cc-block--major">
          <div className="cc-head">
            <h2 className="cc-h cc-h--big">Динаміка по місяцях</h2>
          </div>
          <table className="dyn">
            <thead>
              <tr>
                <th>місяць</th>
                <th>нових учнів</th>
                <th>вартість учня</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  <b>63</b>
                </td>
                <td>23,7$</td>
              </tr>
              <tr>
                <td>2</td>
                <td>
                  <b>71</b>
                </td>
                <td>21,4$</td>
              </tr>
              <tr>
                <td>3</td>
                <td>
                  <b>86</b>
                </td>
                <td>18,6$</td>
              </tr>
              <tr>
                <td>4</td>
                <td>
                  <b>113</b>
                </td>
                <td>15,9$</td>
              </tr>
              <tr>
                <td>5</td>
                <td>
                  <b>137</b>
                </td>
                <td>14,2$</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="cc-block cc-block--major">
          <div className="cc-head">
            <h2 className="cc-h cc-h--big">Результат</h2>
          </div>
          <p>
            За 5 місяців школа перейшла від нерівномірного набору учнів до стабільного та прогнозованого потоку заявок. Реклама стала постійним джерелом нових клієнтів, що дозволило відкривати нові групи та розширити викладацький склад.
          </p>
        </div>
      </div>
      <div className="cc-block cc-block--major">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Скріни з рекламного кабінету</h2>
        </div>
        <div className="shots">
          <figure className="shot-fig">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/language/stat-1.jpg" alt="Школа мов: активні кампанії, ціна за розпочату розмову" width="1400" height="1115" data-full="/assets/img/cases/language/stat-1.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
            <figcaption>Активні кампанії, ціна за розпочату розмову</figcaption>
          </figure>
          <figure className="shot-fig">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/language/stat-2.jpg" alt="Школа мов: статистика рекламних кампаній" width="1400" height="936" data-full="/assets/img/cases/language/stat-2.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
            <figcaption>Статистика рекламних кампаній</figcaption>
          </figure>
          <figure className="shot-fig">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/language/stat-3.jpg" alt="Школа мов: результати кампаній у кабінеті Meta" width="1400" height="936" data-full="/assets/img/cases/language/stat-3.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
            <figcaption>Результати кампаній у кабінеті Meta</figcaption>
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
              <Image src="/assets/img/cases/language/rev-1.jpg" alt="Відгук клієнта: немає куди записувати нових учнів, потрібні викладачі" width="1400" height="417" data-full="/assets/img/cases/language/rev-1.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/language/rev-2.jpg" alt="Відгук клієнта: багато заявок щодня, групи швидко заповнюються" width="1400" height="472" data-full="/assets/img/cases/language/rev-2.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
        </div>
      </div>
    </>
  );
}
