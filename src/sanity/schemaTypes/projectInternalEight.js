// ./schemas/projectInternalPageSix.js

import { defineField, defineType } from "sanity";

export const projectInternalPageEight = defineType({
  name: "projectInternalPageEight",
  title: "Internal Project Page Eight",
  type: "document",
  fields: [
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

    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
    }),

    defineField({
      name: "mainImage",
      title: "Top Image",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "mainImageDarkMode",
      title: "Top Image for Dark Mode",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "introText",
      title: "Intro Text",
      type: "text",
      rows: 5,
    }),

    defineField({
      name: "moreContent",
      title: "Expandable Content",
      type: "array",
      of: [{ type: "text" }],
    }),

    defineField({
      name: "projectDetails",
      title: "Project Details",
      type: "array",
      of: [
        defineField({
          name: "detail",
          title: "Detail",
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              of: [{ type: "string" }],
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: "projectImages",
      title: "Project Images",
      type: "object",
      fields: [
        defineField({
          name: "topImages",
          title: "Top Images",
          type: "array",
          of: [{ type: "image", options: { hotspot: true } }],
        }),
        defineField({
          name: "topImagesDarkMode",
          title: "Top Images for Dark Mode",
          type: "array",
          of: [{ type: "image", options: { hotspot: true } }],
        }),
        defineField({
          name: "bottomImage",
          title: "Bottom Image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "bottomImageDarkMode",
          title: "Bottom Image for Dark Mode",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),

    defineField({
      name: "projectImagesTwo",
      title: "Project Images Two",
      type: "object",
      fields: [
        defineField({
          name: "topImagesTwo",
          title: "Top Images",
          type: "array",
          of: [{ type: "image", options: { hotspot: true } }],
        }),
        defineField({
          name: "topImagesTwoDarkMode",
          title: "Top Images for Dark Mode",
          type: "array",
          of: [{ type: "image", options: { hotspot: true } }],
        }),
        defineField({
          name: "bottomImageTwo",
          title: "Bottom Image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "bottomImageTwoDarkMode",
          title: "Bottom Image for Dark Mode",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
  ],
});
