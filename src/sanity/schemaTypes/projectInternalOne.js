// /schemas/internalPage.ts
import { defineField, defineType } from "sanity";

export const projectInternalPageOne = defineType({
  name: "projectInternalPageOne",
  title: "Internal Project Page One",
  type: "document",
  fields: [
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
    // defineField({
    //   name: "projectLinks",
    //   title: "Linked Info",
    //   type: "array",
    //   of: [
    //     defineField({
    //       type: "object",
    //       fields: [
    //         defineField({
    //           name: "label",
    //           title: "Label",
    //           type: "string",
    //         }),
    //         defineField({
    //           name: "items",
    //           title: "Items",
    //           type: "array",
    //           of: [
    //             defineField({
    //               name: "textLink",
    //               title: "Link Text",
    //               type: "string",
    //             }),
    //             defineField({
    //               name: "url",
    //               title: "URL",
    //               type: "url",
    //               validation: (Rule) =>
    //                 Rule.uri({
    //                   allowRelative: true,
    //                   scheme: ["http", "https"],
    //                 }),
    //             }),
    //           ],
    //         }),
    //       ],
    //     }),
    //   ],
    // }),
    // Add this to the "fields" array
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

    // defineField({
    //   name: "gallerySections",
    //   title: "Image Gallery Sections",
    //   type: "array",
    //   of: [
    //     defineField({
    //       name: "gallery",
    //       title: "Gallery Section",
    //       type: "object",
    //       fields: [
    //         defineField({
    //           name: "images",
    //           title: "Images",
    //           type: "array",
    //           of: [{ type: "image", options: { hotspot: true } }],
    //         }),
    //       ],
    //     }),
    //   ],
    // }),

    // Add this to the "fields" array
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
