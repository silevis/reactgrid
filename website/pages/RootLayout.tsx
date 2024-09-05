import { AppProps } from "next/app";
import Header from "../components/header";

import { Footer } from "@/components/footer";

export default function RootLayout({ pageProps, Component }: AppProps) {
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
