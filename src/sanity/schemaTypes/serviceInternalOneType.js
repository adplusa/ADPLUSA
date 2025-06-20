import { defineField, defineType } from "sanity";

export const servicesInternalOnePage = defineType({
  name: "servicesOnePage",
  title: "Services Internal Page One",
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

    // ✅ Optional Page Title (not used in code but good to have)
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
    }),

    // ✅ Hero Banner Image
    defineField({
      name: "serviceBannerImage",
      title: "Banner Image",
      type: "image",
      options: { hotspot: true },
    }),

    // ✅ Services List
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
              name: "link",
              type: "string",
              title: "Link URL",
              description:
                "Optional: Internal (/page) or External (https://...)",
            },
            {
              name: "isExternal",
              type: "boolean",
              title: "Is External Link?",
              description: "Open in new tab if external",
              initialValue: false,
            },
          ],
        }),
      ],
    }),

    // ✅ Key Activities Section
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

    // ✅ Why Work With Us Section
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
        defineField({
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Reason Title" },
            { name: "description", type: "text", title: "Reason Description" },
          ],
        }),
      ],
    }),
  ],
});
