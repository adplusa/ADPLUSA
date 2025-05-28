// ./schemas/projectInternalPageFour.js

import { defineField, defineType } from "sanity";

export const projectInternalPageFour = defineType({
  name: "projectInternalPageFour",
  title: "Internal Project Page Four",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Page Title", type: "string" }),
    defineField({
      name: "mainImage",
      title: "Top Image",
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
          name: "bottomImage",
          title: "Bottom Image",
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
          name: "bottomImageTwo",
          title: "Bottom Image",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
  ],
});
