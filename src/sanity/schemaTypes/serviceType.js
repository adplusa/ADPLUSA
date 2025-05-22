import { defineField, defineType } from "sanity";

export const servicesPage = defineType({
  name: "servicesOnePage",
  title: "Services Page",
  type: "document",
  fields: [
    // 🏁 Banner Section
    defineField({
      name: "bannerTitle",
      title: "Banner Title",
      type: "string",
    }),
    defineField({
      name: "bannerTags",
      title: "Popular Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "trustedStats",
      title: "Trusted Statistics",
      type: "array",
      of: [
        defineField({
          type: "object",
          fields: [{ name: "label", type: "string", title: "Label" }],
        }),
      ],
    }),

    // 🛠️ Services List
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
          ],
        }),
      ],
    }),

    // 🎠 Carousel Professionals
    defineField({
      name: "professionals",
      title: "Professional Roles Carousel",
      type: "array",
      of: [
        defineField({
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Title" },
            {
              name: "image",
              type: "image",
              title: "Image",
              options: { hotspot: true },
            },
          ],
        }),
      ],
    }),

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

    // 💼 Specialization Section
    defineField({
      name: "specialization",
      title: "Specialization CTA Section",
      type: "object",
      fields: [
        { name: "buttonText", type: "string", title: "CTA Button Text" },
        {
          name: "image",
          type: "image",
          title: "Right Image",
          options: { hotspot: true },
        },
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

    // 📰 Article/Blog Section
    // defineField({
    //   name: "articles",
    //   title: "Informational Articles",
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
    //         { name: "alt", type: "string", title: "Alt Text" },
    //       ],
    //     }),
    //   ],
    // }),

    // 💬 Final CTA
    defineField({
      name: "finalCTA",
      title: "Final Call To Action",
      type: "object",
      fields: [
        { name: "ctaTitle", type: "string", title: "CTA Title" },
        { name: "ctaButton", type: "string", title: "Button Text" },
      ],
    }),
  ],
});
