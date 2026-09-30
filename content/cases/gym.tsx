import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";

export default function CaseGym() {
  return (
    <>
      <header className="chero">
        <div className="chero-text">
          <span className="label">кейс 08 · маркетинг під ключ</span>
          <h1 className="chero-h">
            Запуск спортзалу{" "}
            <span className="ac">з нуля</span>
          </h1>
          <p className="chero-lead">Як новий спортзал вийшов на ринок з готовою маркетинговою системою</p>
          <div className="chero-meta">
            <span>Фітнес</span>
            <span>Запуск з нуля</span>
            <span>3 місяці</span>
          </div>
          <Link href="/#contact" className="btn btn--signal btn--lg">
            Обговорити ваш проєкт
            <span className="arr" aria-hidden="true">→</span>
          </Link>
        </div>
        <figure className="chero-media">
          <Image src="/assets/img/cases/gym/cover.jpg" alt="Кейс marketingpro: Запуск спортзалу з нуля" width="900" height="675" sizes="(max-width: 900px) 100vw, 640px" />
          <figcaption>
            <b>79</b>
            <i>
              нових клієнтів
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
            Новий спортзал, який звернувся до нас ще до відкриття. Бізнес запускався з нуля — без оформлених соцмереж, реклами та маркетингової системи.
          </p>
        </div>
        <div>
          <div className="cc-h">Запит клієнта</div>
          <p>
            Підготувати спортзал до відкриття, побудувати маркетингову систему з нуля та забезпечити стабільний потік нових клієнтів через рекламу.
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
            <h3 className="road-h">Повна підготовка до запуску</h3>
            <ul className="road-list">
              <li>Розробили візуальну айдентику бренду</li>
              <li>Підготували дизайн соцмереж</li>
              <li>Створили рекламні банери, вивіску, візитівки та інші маркетингові матеріали</li>
            </ul>
          </li>
          <li className="road-step">
            <span className="road-no" aria-hidden="true">02</span>
            <h3 className="road-h">Контент-стратегія</h3>
            <ul className="road-list">
              <li>Розробили структуру контенту, сценарії для відео та тексти для постів</li>
              <li>Сформували контент, який підвищує довіру до бренду та мотивує записатися на тренування</li>
            </ul>
          </li>
          <li className="road-step">
            <span className="road-no" aria-hidden="true">03</span>
            <h3 className="road-h">Рекламна система</h3>
            <ul className="road-list">
              <li>Налаштували та оптимізували рекламні кампанії, протестували креативи й оффери</li>
              <li>Масштабували найефективніші рекламні зв'язки</li>
            </ul>
          </li>
          <li className="road-step">
            <span className="road-no" aria-hidden="true">04</span>
            <h3 className="road-h">Воронка продажів</h3>
            <ul className="road-list">
              <li>Побудували шлях клієнта від першого контакту з рекламою до покупки абонемента</li>
              <li>Оптимізували обробку заявок і запис на тренування</li>
            </ul>
          </li>
        </ol>
      </div>
      <div className="cc-block cc-block--card">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Результати на третій місяць співпраці</h2>
        </div>
        <div className="nums">
          <div>
            <b>824$</b>
            <span>бюджет</span>
          </div>
          <div>
            <b>515</b>
            <span>всього переписок</span>
          </div>
          <div>
            <b>1,6$</b>
            <span>ціна переписки</span>
          </div>
          <div>
            <b>79</b>
            <span>нових клієнтів</span>
          </div>
          <div>
            <b>10,4$</b>
            <span>вартість клієнта</span>
          </div>
          <div>
            <b>6 895$</b>
            <span>дохід</span>
          </div>
          <div>
            <b className="sig">837%</b>
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
                  <span className="bar bar--was" style={{ "--w": "12.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">824$</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">дохід</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "100.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">6 895$</b>
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-name">З переписок — клієнти (15%)</div>
              <div className="bar-line">
                <span className="bar-cap">всього переписок</span>
                <span className="bar-track">
                  <span className="bar bar--was" style={{ "--w": "100.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">515</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">з них клієнтів</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "15.3%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">79</b>
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
          За три місяці вдалося не лише успішно вивести новий спортзал на ринок, а й побудувати маркетингову систему, яка стабільно залучає нових клієнтів і створює основу для подальшого масштабування бізнесу.
        </p>
      </div>
      <div className="cc-block cc-block--major">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Скріни з рекламного кабінету</h2>
        </div>
        <div className="shots">
          <figure className="shot-fig">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/gym/stat-1.jpg" alt="Спортзал: активні кампанії й ціна за розпочату розмову" width="1400" height="1375" data-full="/assets/img/cases/gym/stat-1.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
            <figcaption>Активні кампанії й ціна за розпочату розмову</figcaption>
          </figure>
          <figure className="shot-fig">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/gym/stat-2.jpg" alt="Спортзал: результати рекламних кампаній" width="1056" height="1400" data-full="/assets/img/cases/gym/stat-2.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
            <figcaption>Результати рекламних кампаній</figcaption>
          </figure>
          <figure className="shot-fig">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/gym/stat-3.jpg" alt="Спортзал: статистика кампаній у кабінеті Meta" width="1013" height="1400" data-full="/assets/img/cases/gym/stat-3.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
            <figcaption>Статистика кампаній у кабінеті Meta</figcaption>
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
              <Image src="/assets/img/cases/gym/rev-1.jpg" alt="Відгук клієнта: багато людей пишуть і одразу записуються" width="1400" height="341" data-full="/assets/img/cases/gym/rev-1.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
          <figure className="shot-fig">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/gym/rev-2.jpg" alt="Відгук клієнта: рілси по сотні тисяч переглядів, підписники ростуть" width="1400" height="879" data-full="/assets/img/cases/gym/rev-2.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
        </div>
      </div>
    </>
  );
}
