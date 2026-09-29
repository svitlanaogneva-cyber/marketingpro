import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";

export default function CaseBeauty() {
  return (
    <>
      <header className="chero">
        <div className="chero-text">
          <span className="label">кейс 07 · таргетована реклама</span>
          <h1 className="chero-h">
            Студія краси повного{" "}
            <span className="ac">циклу</span>
          </h1>
          <p className="chero-lead">Таргетована реклама, яка щодня заповнює графік майстрів</p>
          <div className="chero-meta">
            <span>Б'юті</span>
            <span>Студія повного циклу</span>
          </div>
          <Link href="/#contact" className="btn btn--signal btn--lg">
            Обговорити ваш проєкт
            <span className="arr" aria-hidden="true">→</span>
          </Link>
        </div>
        <figure className="chero-media">
          <Image src="/assets/img/cases/beauty/cover.jpg" alt="" width="900" height="675" sizes="(max-width: 900px) 100vw, 640px" />
          <figcaption>
            <b>829%</b>
            <i>
              roas
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
            Студія краси з повним спектром послуг. Нижче — порівняння останнього місяця до співпраці з нами й першого місяця роботи разом.
          </p>
        </div>
        <div>
          <div className="cc-h">Запит клієнта</div>
          <p>
            Залучити нових клієнтів через Instagram-рекламу та побудувати систему регулярного завантаження майстрів.
          </p>
        </div>
      </div>
      <div className="cc-block cc-block--major">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Що зробили</h2>
        </div>
        <ul className="cc-list">
          <li>Налаштували таргетовану рекламу з фокусом на локальну аудиторію</li>
          <li>Створили креативи на основі реальних робіт майстрів, щоб підсилити довіру</li>
          <li>Оптимізували сторінку Instagram для підвищення конверсії в запис</li>
          <li>Вибудували швидку та ефективну комунікацію в Direct</li>
          <li>Впровадили акційні пропозиції для залучення нових клієнтів</li>
        </ul>
      </div>
      <div className="cc-block cc-block--card">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Місяць без нас → місяць з нами</h2>
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
                <b className="bar-val">10,1$</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">стало</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "29.7%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">3$</b>
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-name">Вартість клієнта</div>
              <div className="bar-line">
                <span className="bar-cap">було</span>
                <span className="bar-track">
                  <span className="bar bar--was" style={{ "--w": "100.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">22,2$</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">стало</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "36.9%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">8,2$</b>
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-name">Дохід за місяць</div>
              <div className="bar-line">
                <span className="bar-cap">було</span>
                <span className="bar-track">
                  <span className="bar bar--was" style={{ "--w": "27.5%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">2 649$</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">стало</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "100.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">9 650$</b>
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-name">ROAS</div>
              <div className="bar-line">
                <span className="bar-cap">було</span>
                <span className="bar-track">
                  <span className="bar bar--was" style={{ "--w": "24.7%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">205%</b>
              </div>
              <div className="bar-line">
                <span className="bar-cap">стало</span>
                <span className="bar-track">
                  <span className="bar bar--now" style={{ "--w": "100.0%" } as CSSProperties}></span>
                </span>
                <b className="bar-val">829%</b>
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
          Студія отримала стабільний потік нових клієнтів через рекламу. Графік майстрів став рівномірно заповненим, без «порожніх» днів. Послуги мають повторний попит — клієнти повертаються регулярно, формуючи довгострокову базу постійних клієнтів.
        </p>
      </div>
      <div className="cc-block cc-block--major">
        <div className="cc-head">
          <h2 className="cc-h cc-h--big">Скріни з рекламного кабінету</h2>
        </div>
        <div className="shots">
          <figure className="shot-fig">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/beauty/stat-1.jpg" alt="Салон краси: активні кампанії й ціна за розпочату розмову" width="1400" height="1094" data-full="/assets/img/cases/beauty/stat-1.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
            <figcaption>Активні кампанії й ціна за розпочату розмову</figcaption>
          </figure>
          <figure className="shot-fig">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/beauty/stat-2.jpg" alt="Салон краси: результати кампаній — косметолог, статичні креативи" width="1127" height="1400" data-full="/assets/img/cases/beauty/stat-2.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
            <figcaption>Результати кампаній — косметолог, статичні креативи</figcaption>
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
              <Image src="/assets/img/cases/beauty/rev-1.jpg" alt="Відгук клієнта: за вчора 8 нових клієнтів" width="1400" height="263" data-full="/assets/img/cases/beauty/rev-1.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/beauty/rev-2.jpg" alt="Відгук клієнта: сьогодні 5 клієнтів" width="1400" height="292" data-full="/assets/img/cases/beauty/rev-2.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/beauty/rev-3.jpg" alt="Відгук клієнта: щоденні записи, у тому числі до косметолога" width="1400" height="571" data-full="/assets/img/cases/beauty/rev-3.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
          <figure className="shot-fig shot-fig--wide">
            <button className="shot" type="button">
              <Image src="/assets/img/cases/beauty/rev-4.jpg" alt="Відгук клієнта: за вчора 10 записів на 28 600 грн" width="1400" height="999" data-full="/assets/img/cases/beauty/rev-4.jpg" sizes="(max-width: 700px) 100vw, 1000px" />
            </button>
          </figure>
        </div>
      </div>
    </>
  );
}
