// schemas/servicesFourPage.js
import { defineField, defineType } from "sanity";

export const servicesInternalFourPage = defineType({
  name: "servicesFourPage",
  title: "Services Internal Page Four",
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

    // ✅ Page title (optional)
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

    // ✅ Services list (used in .service-info section)
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

    // ✅ Key activities section
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
  ],
});
