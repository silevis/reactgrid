import { Metadata } from "next";
import { DM_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "../components/header";
import { Footer } from "@/components/footer";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import CookieConsentComponent from "../components/cookie-consent";
import GoogleAnalytics from "@/components/google-analytics";
import Script from "next/script";

const dm_sans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

const dm_mono = DM_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  title: "ReactGrid | Spreadsheet experience for your React app",
  description:
    "ReactGrid is a component for displaying and editing data in a spreadsheet-like way.",
  icons: [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_PATH}/static/favicon.svg`,
    },
  ],
  openGraph: {
    title: "ReactGrid | Spreadsheet experience for your React app",
    description:
      "ReactGrid is a component for displaying and editing data in a spreadsheet-like way.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dm_mono.variable} ${dm_sans.variable}`}>
      <body>
        <Script id="">
          {`
              if (!window.localStorage.getItem("theme_default")) {
                window.localStorage.setItem("theme", "light");
                window.localStorage.setItem("theme_default", "light");
                document.documentElement.classList.add("light");
                document.documentElement.classList.remove("dark");
              }
          `}
        </Script>
        <GoogleAnalytics />
        <Header>
          {children}
          <Footer />
        </Header>
        <CookieConsentComponent />
      </body>
    </html>
  );
}
