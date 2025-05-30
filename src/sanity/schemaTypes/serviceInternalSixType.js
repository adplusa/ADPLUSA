// schemas/servicesSixPage.js
import { defineField, defineType } from "sanity";

export const servicesInternalSixPage = defineType({
  name: "servicesSixPage",
  title: "Services Internal Page Six",
  type: "document",
  fields: [
    // defineField({ name: "bannerTitle", title: "Banner Title", type: "string" }),
    // defineField({
    //   name: "bannerTags",
    //   title: "Popular Tags",
    //   type: "array",
    //   of: [{ type: "string" }],
    // }),
    // defineField({
    //   name: "trustedStats",
    //   title: "Trusted Statistics",
    //   type: "array",
    //   of: [
    //     defineField({
    //       type: "object",
    //       fields: [{ name: "label", type: "string", title: "Label" }],
    //     }),
    //   ],
    // }),

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
    // defineField({
    //   name: "specialization",
    //   title: "Specialization CTA Section",
    //   type: "object",
    //   fields: [
    //     { name: "buttonText", type: "string", title: "CTA Button Text" },
    //     {
    //       name: "image",
    //       type: "image",
    //       title: "Right Image",
    //       options: { hotspot: true },
    //     },
    //   ],
    // }),
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
    // defineField({
    //   name: "finalCTA",
    //   title: "Final Call To Action",
    //   type: "object",
    //   fields: [
    //     { name: "ctaTitle", type: "string", title: "CTA Title" },
    //     { name: "ctaButton", type: "string", title: "Button Text" },
    //   ],
    // }),
  ],
});
