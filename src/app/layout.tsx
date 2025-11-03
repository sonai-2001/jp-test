import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import LayoutWrapper from "./components/LayoutWrapper/LayoutWrapper";
import { Toaster } from "react-hot-toast";
import { Providers } from "./services/redux/provider";
import "suneditor/dist/css/suneditor.min.css";
import Head from "next/head";
import { Open_Sans, Poppins } from "next/font/google";
import Script from "next/script";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Open Sans ko configure karein
const openSans = Open_Sans({
  subsets: ["latin"], // Common subset
  display: "swap", // Font display strategy
  weight: ["300", "400", "600", "700"], // Zaroori weights
  variable: "--font-opensans", // CSS variable ka naam (apni marzi se)
  style: ["normal", "italic"], // Agar italic style chahiye
});

// Poppins ko configure karein
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"], // Zaroori weights
  variable: "--font-poppins", // CSS variable ka naam
  style: ["normal", "italic"], // Agar italic style chahiye
});

export const metadata: Metadata = {
  title: "Jaypee Associates",
  description: "Welcome to Jaypee Associates.",
};
const isStaging = process.env.NEXT_PUBLIC_BASE_URL?.includes("staging");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        {isStaging && <meta name="robots" content="noindex, nofollow" />}
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
        </style>
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable} ${poppins.variable}`}
      >
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-567DQTKD');
            `,
          }}
        />

        <Providers>
          <Toaster position="top-right" reverseOrder={false} />
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-567DQTKD"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      </body>
    </html>
  );
}
