import SocialMediaClient from "./SocialMediaClient";
import { getContact } from "@/lib/cms-client";

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
export default async function SocialMediaPage() {
  const data = await getContact({ revalidate: 0 });
  const socialLinks = data?.socialLinks?.filter(link => link.isActive) || [];

  return <SocialMediaClient socialLinks={socialLinks} />;
}
