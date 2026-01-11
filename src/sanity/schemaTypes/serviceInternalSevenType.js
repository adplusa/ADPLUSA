// schemas/serviceInternalSevenPage.js

import { defineField, defineType } from "sanity";

const serviceInternalSevenPage = defineType({
  name: "serviceInternalSevenPage",
  title: "Services Internal Page Seven",
  type: "document",
  fields: [
    // ✅ SEO fields
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "string",
    }),

    // ✅ Optional Page Title
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
    }),

    // ✅ Banner Image
    defineField({
      name: "serviceBannerImage",
      title: "Banner Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "serviceBannerImageDarkMode",
      title: "Banner Image for Dark Mode",
      type: "image",
      options: { hotspot: true },
    }),

    // ✅ Services List (with link)
    defineField({
      name: "servicesList",
      title: "Services Offered",
      type: "array",
      of: [
        defineField({
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Service Title" },
            { name: "description", type: "text", title: "Service Description" },
            {
              name: "image",
              type: "image",
              title: "Service Image",
              options: { hotspot: true },
              fields: [{ name: "alt", type: "string", title: "Alt Text" }],
            },
            {
              name: "imageDarkMode",
              type: "image",
              title: "Service Image for Dark Mode",
              options: { hotspot: true },
              fields: [{ name: "alt", type: "string", title: "Alt Text" }],
            },
            {
              name: "link",
              type: "string",
              title: "Link URL",
              description:
                "Optional: Redirect URL (e.g., /services/design or https://external.com)",
            },
            {
              name: "isExternal",
              type: "boolean",
              title: "Is External Link?",
              description: "Check if this link is external (opens in new tab)",
              initialValue: false,
            },
          ],
        }),
      ],
    }),

    // ✅ Key Activities
    defineField({
      name: "keyActivities",
      title: "Key Activities",
      type: "array",
      of: [
        defineField({
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Activity Title" },
            {
              name: "description",
              type: "text",
              title: "Activity Description",
            },
          ],
        }),
      ],
    }),
  ],
});

export default serviceInternalSevenPage;
