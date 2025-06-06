import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./Components/Header/page";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ADPL Consulting LLC",
  description:
    "ADPL Consulting LLC is a trusted partner to architects, engineers, contractors, and real estate consultants across India and the U.S. Backed by 9 years of global exposure",
};

// export const metadata = {
//   title: "My Website",
//   description: "Welcome to my awesome website",
//   openGraph: {
//     title: "My Website",
//     description: "Explore content and services",
//     url: "https://mywebsite.com",
//     siteName: "MyWebsite",
//     images: [
//       {
//         url: "https://mywebsite.com/og-image.png",
//         width: 800,
//         height: 600,
//       },
//     ],
//     locale: "en_US",
//     type: "website",
//   },
// };

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          {children}
        </body>
      </html>
    </>
  );
}
