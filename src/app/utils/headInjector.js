/**
 * Utility to inject raw HTML string (meta tags, scripts, link tags) into document.head
 * Designed for use in Client Components useEffect
 *
 * @param {string} htmlString - The raw HTML string containing tags
 * @param {string} id - Unique identifier to group and cleanup tags (e.g., 'homepage-custom-head')
 */
export const injectHeadTags = (htmlString, id) => {
    if (typeof window === "undefined" || !htmlString) return;

    // Remove existing tags with this ID
    const existingTags = document.head.querySelectorAll(
        `[data-custom-head="${id}"]`
    );
    existingTags.forEach((tag) => tag.remove());

    if (!htmlString.trim()) return;

    const head = document.head;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;

    Array.from(tempDiv.children).forEach((child) => {
        let newTag;

        // Re-create scripts to ensure they execute
        if (child.tagName === "SCRIPT") {
            newTag = document.createElement("script");
            // Copy attributes
            Array.from(child.attributes).forEach((attr) => {
                newTag.setAttribute(attr.name, attr.value);
            });
            // Copy content
            newTag.textContent = child.textContent;
        } else {
            // Clone other nodes
            newTag = child.cloneNode(true);
        }

        // Mark tag for cleanup
        newTag.setAttribute("data-custom-head", id);
        head.appendChild(newTag);
    });
};

/**
 * Remove custom head tags by ID
 * Call this in useEffect cleanup to remove page-specific tags when navigating away
 *
 * @param {string} id - Unique identifier of tags to remove (e.g., 'homepage-custom-head')
 */
export const removeHeadTags = (id) => {
    if (typeof window === "undefined") return;

    const existingTags = document.head.querySelectorAll(
        `[data-custom-head="${id}"]`
    );
    existingTags.forEach((tag) => tag.remove());
};
