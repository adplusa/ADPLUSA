import { defineField, defineType } from "sanity";

export const servicesInternalTwoPage = defineType({
  name: "servicesTwoPage",
  title: "Services Internal Page Two",
  type: "document",

  fields: [
    // ✅ SEO
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

    // ✅ Optional page title (not used in code, but okay)
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
    }),

    // ✅ Hero banner image
    defineField({
      name: "serviceBannerImage",
      title: "Banner Image",
      type: "image",
      options: { hotspot: true },
    }),

    // ✅ Services list
    defineField({
      name: "servicesList",
      title: "Services Offered",
      type: "array",
      of: [
        {
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
              name: "link",
              type: "string",
              title: "Link URL",
              description:
                "Optional: Internal (/page) or external (https://...)",
            },
            {
              name: "isExternal",
              type: "boolean",
              title: "Is External Link?",
              description: "Open in new tab if external",
              initialValue: false,
            },
          ],
        },
      ],
    }),

    // ✅ Key activities
    defineField({
      name: "keyActivities",
      title: "Key Activities",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Activity Title" },
            {
              name: "description",
              type: "text",
              title: "Activity Description",
            },
          ],
        },
      ],
    }),

    // ✅ Why work with us image + features
    defineField({
      name: "founderImage",
      title: "Why Work With Us Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "reasonsToWork",
      title: "Reasons To Work With Us",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Reason Title" },
            { name: "description", type: "text", title: "Reason Description" },
          ],
        },
      ],
    }),
  ],
});
