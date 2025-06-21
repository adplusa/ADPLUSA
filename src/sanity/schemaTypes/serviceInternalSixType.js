// schemas/servicesSixPage.js
import { defineField, defineType } from "sanity";

export const servicesInternalSixPage = defineType({
  name: "servicesSixPage",
  title: "Services Internal Page Six",
  type: "document",
  fields: [
    // ✅ SEO meta
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

    // ✅ Optional page title
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
    }),

    // ✅ Hero/banner image
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

    // ✅ Key Activities
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
