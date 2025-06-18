import { defineField, defineType } from "sanity";

export const servicesInternalOnePage = defineType({
  name: "servicesOnePage",
  title: "Services Internal Page One",
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
      type: "string",
      title: "Page Title",
    }),

    defineField({
      name: "serviceBannerImage",
      title: "Select Image For Banner",
      type: "image",
      options: { hotspot: true },
    }),

    // 🛠️ Services List with Link Options
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
                "Optional: Add a link to redirect when clicked (e.g., /services/web-design or https://example.com)",
            },
            {
              name: "isExternal",
              type: "boolean",
              title: "Is External Link?",
              description:
                "Check if this is an external link (opens in new tab)",
              initialValue: false,
            },
          ],
        }),
      ],
    }),

    // 🎠 Carousel Professionals with Link Options
    // defineField({
    //   name: "professionals",
    //   title: "Professional Roles Carousel",
    //   type: "array",
    //   of: [
    //     defineField({
    //       type: "object",
    //       fields: [
    //         { name: "title", type: "string", title: "Title" },
    //         {
    //           name: "image",
    //           type: "image",
    //           title: "Image",
    //           options: { hotspot: true },
    //         },
    //         {
    //           name: "link",
    //           type: "string",
    //           title: "Link URL",
    //           description:
    //             "Optional: Add a link to redirect when clicked (e.g., /services/consulting or https://example.com)",
    //         },
    //         {
    //           name: "isExternal",
    //           type: "boolean",
    //           title: "Is External Link?",
    //           description:
    //             "Check if this is an external link (opens in new tab)",
    //           initialValue: false,
    //         },
    //       ],
    //     }),
    //   ],
    // }),

    // 🎯 Key Activities in Schematic Design
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

    // 🚀 Why Work With Us Features
    defineField({
      name: "founderImage",
      title: "Founder Image",
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
            { name: "title", type: "string", title: "Title" },
            { name: "description", type: "text", title: "Description" },
          ],
        }),
      ],
    }),
  ],
});
