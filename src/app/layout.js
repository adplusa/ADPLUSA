import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import EnquiryForm from "@/app/Components/Enquiry/page";
import { getGeneralSettings } from "@/lib/cms-client";
import { ThemeProvider } from "@/app/Components/ThemeProvider";
import Script from "next/script";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

/**
 * Generate metadata dynamically from CMS
 * This is the recommended Next.js approach - no hydration issues
 */
export async function generateMetadata() {
    const settings = await getGeneralSettings({ revalidate: 60 });

    return {
        title: settings?.siteName || "ADPL Consulting LLC",
        description:
            settings?.siteDescription ||
            "ADPL Consulting LLC is a trusted partner to architects, engineers, contractors, and real estate consultants across India and the U.S. Backed by 9 years of global exposure",
        icons: {
            icon: settings?.favicon?.url || "/icon.png",
            apple: settings?.favicon?.url || "/icon.png",
        },
    };
}

/**
 * Parse custom head tags and extract scripts for Next.js Script component
 * Returns { scripts: [], otherTags: string }
 */
function parseCustomHeadTags(htmlString) {
    if (!htmlString) return { scripts: [], inlineScripts: [] };

    const scripts = [];
    const inlineScripts = [];

    // Match script tags with src attribute
    const srcScriptRegex = /<script[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi;
    let match;
    while ((match = srcScriptRegex.exec(htmlString)) !== null) {
        scripts.push(match[1]);
    }

    // Match inline scripts
    const inlineScriptRegex = /<script[^>]*>([^<]+)<\/script>/gi;
    while ((match = inlineScriptRegex.exec(htmlString)) !== null) {
        // Skip if it has a src (already captured above)
        if (!match[0].includes("src=")) {
            inlineScripts.push(match[1]);
        }
    }

    return { scripts, inlineScripts };
}

export default async function RootLayout({ children }) {
    const settings = await getGeneralSettings({ revalidate: 60 });
    const { scripts, inlineScripts } = parseCustomHeadTags(
        settings?.customHeadTags,
    );

    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <ThemeProvider>{children}</ThemeProvider>
                <EnquiryForm />

                {/* External scripts from CMS - loaded after page is interactive */}
                {scripts.map((src, index) => (
                    <Script
                        key={`cms-script-${index}`}
                        src={src}
                        strategy="afterInteractive"
                    />
                ))}

                {/* Inline scripts from CMS */}
                {inlineScripts.map((content, index) => (
                    <Script
                        key={`cms-inline-${index}`}
                        id={`cms-inline-${index}`}
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                ))}
            </body>
        </html>
    );
}
