import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import EnquiryForm from "@/app/Components/Enquiry/page";
import DynamicFavicon from "@/app/Components/DynamicFavicon/page";

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
    icons: {
        icon: "/icon.png",
        apple: "/icon.png",
    },
};

export default function RootLayout({ children }) {
    return (
        <>
            <html lang="en">
                <body className={`${geistSans.variable} ${geistMono.variable}`}>
                    <DynamicFavicon />
                    {children}
                    <EnquiryForm />
                </body>
            </html>
        </>
    );
}
