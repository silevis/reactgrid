import Header from "../components/header";

import { Footer } from "@/components/footer";
import { AppPropsWithLayout } from "./_app";


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
