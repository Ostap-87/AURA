import Script from "next/script";

/**
 * Места вставки счётчиков через переменные окружения (PROJECT.md, раздел 11).
 * Идентификаторы пока пустые — пока переменная не задана, счётчик не рендерится
 * и на страницу не попадает ни байта аналитики.
 */
export function Analytics() {
  const metrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <>
      {metrikaId && (
        <>
          <Script id="yandex-metrika" strategy="afterInteractive">
            {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],
              k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
              ym(${JSON.stringify(metrikaId)}, "init", {clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:false});`}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://mc.yandex.ru/watch/${metrikaId}`}
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </noscript>
        </>
      )}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', ${JSON.stringify(gaId)});`}
          </Script>
        </>
      )}
    </>
  );
}
