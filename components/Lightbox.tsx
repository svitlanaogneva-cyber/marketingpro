/** Порожній контейнер лайтбокса; наповнює його lib/effects.ts. */
export default function Lightbox() {
  return (
    <div className="lbox" id="lbox" role="dialog" aria-modal="true" aria-label="Перегляд скріншота">
      <button className="lbox-close" type="button" aria-label="Закрити">×</button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="" alt="" id="lboxImg" />
      <video id="lboxVideo" controls playsInline preload="none"></video>
    </div>
  );
}
