import React from "react";
import { Footer } from "@/components/footer";
import "../app/globals.css";
import { AppProps } from "next/app";

export const metadata = {
  title: "ReactGrid Website",
  description: "Spreadsheet experience for your React app",
};

export default function RootLayout({ pageProps, Component }: AppProps) {
  return (
    // <html lang="en" className={`${dm_mono.variable} ${dm_sans.variable}`}>
    //   <body>
    <React.Fragment>
      <Component {...pageProps} />
      <Footer />
    </React.Fragment>
    //   </body>
    // </html>
  );
}
