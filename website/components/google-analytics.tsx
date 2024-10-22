"use client";

import Script from "next/script";

export default function GoogleAnalytics() {
  return (
    <>
      {/* <Script
        type="text/plain"
        data-category="analytics"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_MEASUREMENT_ID}`}
      />

      <Script type="text/plain" data-category="analytics" id="">
        {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              });
          `}
      </Script> */}
    </>
  );
}
