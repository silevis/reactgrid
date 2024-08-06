import type { Metadata, NextPage } from "next";
import Header from "../components/header";
import { Footer } from "@/components/footer";
import { ReactElement, ReactNode } from "react";
import { AppProps } from "next/app";
import "../app/globals.css";



export const metadata: Metadata = {
  title: "ReactGrid Website",
  description: "Spreadsheet experience for your React app",
};

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function RootLayout({
  pageProps,
  Component,
}: AppPropsWithLayout) {
  return (
    // <html lang="en" className={`${dm_mono.variable} ${dm_sans.variable}`}>
    //   <body>
    <Header>
      <Component {...pageProps} />

      <Footer />
    </Header>
    //   </body>
    // </html>
  );
}
