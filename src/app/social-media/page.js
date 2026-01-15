import SocialMediaClient from "./SocialMediaClient";

/**
 * Server-side metadata generation for SEO
 * This runs on the server and provides proper SEO tags
 */
export async function generateMetadata() {
  return {
    title: "Social Media | ADPL Consulting",
    description: "Connect with ADPL Consulting on social media - Instagram, Facebook, LinkedIn, WhatsApp, and YouTube",
    openGraph: {
      title: "Social Media | ADPL Consulting",
      description: "Connect with ADPL Consulting on social media - Instagram, Facebook, LinkedIn, WhatsApp, and YouTube",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Server Component - renders the social media page
 */
export default function SocialMediaPage() {
  return <SocialMediaClient />;
}
