import Script from "next/script";

/**
 * Аналітика вмикається лише якщо в Vercel задані ID (нічого не вантажиться «про запас»):
 *   NEXT_PUBLIC_GA_ID         — Google Analytics 4, формат G-XXXXXXXXXX
 *   NEXT_PUBLIC_META_PIXEL_ID — Meta Pixel, лише цифри
 * Скрипти вантажаться після гідратації (afterInteractive), тож швидкість першого екрана не страждає.
 * Заявка з форми відправляє подію Lead (Meta) і generate_lead (GA4) — див. lib/effects.ts.
 */
const GA = /^G-[A-Z0-9]{6,}$/.test(process.env.NEXT_PUBLIC_GA_ID || "") ? process.env.NEXT_PUBLIC_GA_ID : "";
const PIXEL = /^\d{6,}$/.test(process.env.NEXT_PUBLIC_META_PIXEL_ID || "") ? process.env.NEXT_PUBLIC_META_PIXEL_ID : "";

export default function Analytics() {
  if (!GA && !PIXEL) return null;
  return (
    <>
      {GA && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA}');`}</Script>
        </>
      )}
      {PIXEL && (
        <Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL}');fbq('track','PageView');`}</Script>
      )}
    </>
  );
}
