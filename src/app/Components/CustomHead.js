import Head from "next/head";
import parse from "html-react-parser";

/**
 * Component to render custom head tags (meta, link, script, etc.)
 * Safe to use with trusted content from CMS.
 *
 * @param {Object} props
 * @param {string} props.customHeadTags - Raw HTML string containing head tags
 */
export default function CustomHead({ customHeadTags }) {
    if (!customHeadTags) return null;

    // We are using native Next.js logic. Next.js App Router doesn't use <Head> like Pages Router.
    // In App Router, we return tags directly or use metadata API.
    // HOWEVER, injecting raw HTML strings into <head> in App Router is tricky.
    // We can render them directly if this component is placed inside the <head> or if we return them.
    // BUT, parse() returns React elements.
    // The plan said: "safely renders the htmlContent string (likely using `html-react-parser`)"

    // Since we are likely placing this in layout.js or page.js which renders children,
    // we should check where it is placed.
    // If placed in `layout.js`, it should probably be rendered.
    // Note: App Router automatically dedupes meta tags if they match keys.
    // Raw tags like <script> or custom <meta> might just work if rendered.

    return <>{parse(customHeadTags)}</>;
}
