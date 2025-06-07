// schemas/servicesFivePage.js
import { defineField, defineType } from "sanity";

export const servicesInternalFivePage = defineType({
  name: "servicesFivePage",
  title: "Services Internal Page Five",
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
