import { defineField, defineType } from "sanity";

export const servicesInternalThreePage = defineType({
  name: "servicesThreePage",
  title: "Services Internal Page Three",
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

    // ✅ Optional page title (not directly used in code)
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
    }),

    // ✅ Banner image
    defineField({
      name: "serviceBannerImage",
      title: "Banner Image",
      type: "image",
      options: { hotspot: true },
    }),

    // ✅ Section title (used in your `<h1>{data.sectionTitle}</h1>`)
    defineField({
      name: "sectionTitle",
      title: "Section Title",
      type: "string",
      description: "Title for the main separated services block",
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

    // ✅ Why work with us block
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
