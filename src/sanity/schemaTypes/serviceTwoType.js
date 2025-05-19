import { defineField, defineType } from "sanity";

export const serviceType = defineType({
  name: "serviceTwoPage",
  title: "Service Two Page",
  type: "document",
  fields: [
    // Banner
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "BannerTitle", type: "string" }),
        defineField({
          name: "buttonText",
          title: "Banner Button Text",
          type: "string",
        }),
        defineField({
          name: "features",
          title: "Features",
          type: "array",
          of: [
            defineField({
              type: "object",
              fields: [
                defineField({
                  name: "icon",
                  title: "Icon Emoji",
                  type: "string",
                }),
                defineField({ name: "text", title: "Text", type: "string" }),
              ],
            }),
          ],
        }),
      ],
    }),

    // Banner Green Box Content
    defineField({
      name: "trustSection",
      title: "Trust Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
      ],
    }),

    defineField({
      name: "serviceRelatedIcon",
      title: "Service Related Icons",
      type: "array",
      of: [
        defineField({
          type: "object",
          fields: [
            defineField({
              name: "serviceRelatedImg",
              title: "Service Icon Image",
              type: "image",
            }),
            defineField({
              name: "serviceRelatedNumber",
              title: "Service Number",
              type: "string",
            }),
            defineField({
              name: "serviceRelatedName",
              title: "Service Name",
              type: "string",
            }),
          ],
        }),
      ],
    }),

    // defineField({
    //   name: "activitiesOutcomes",
    //   title: "Activities and Outcomes",
    //   type: "object",
    //   fields: [
    //     defineField({ name: "heading", title: "Heading", type: "string" }),
    //     defineField({
    //       name: "subheading",
    //       title: "Subheading",
    //       type: "string",
    //     }),
    //     defineField({
    //       name: "cards",
    //       title: "Cards",
    //       type: "array",
    //       of: [
    //         defineField({
    //           type: "object",
    //           fields: [
    //             defineField({
    //               name: "icon",
    //               title: "Icon Emoji",
    //               type: "string",
    //             }),
    //             defineField({ name: "title", title: "Title", type: "string" }),
    //             defineField({
    //               name: "description",
    //               title: "Description",
    //               type: "text",
    //             }),
    //             defineField({
    //               name: "cardlink",
    //               title: "Card Link",
    //               type: "string",
    //             }),
    //           ],
    //         }),
    //       ],
    //     }),
    //   ],
    // }),

    //Service Box
    defineField({
      name: "serviceHeading",
      title: "Service Heading",
      type: "string",
    }),
    defineField({
      name: "serviceBox",
      title: "Service Box",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "boxUrl",
              title: "Service Box URL",
              type: "url",
              validation: (Rule) =>
                Rule.uri({
                  scheme: ["http", "https", "mailto", "tel"],
                }),
            },
            {
              name: "serviceBoxImg",
              title: "Service Box Img",
              type: "image",
            },
            {
              name: "serviceBoxTitle",
              title: "Service Box Title",
              type: "string",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "home_services_cta",
      title: "Service CTA",
      type: "string",
    }),

    // Why Work With us
    defineField({
      name: "whyWorkWithUs",
      title: "Why Work With Us Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({
          name: "features",
          title: "Features",
          type: "array",
          of: [
            defineField({
              type: "object",
              fields: [
                defineField({
                  name: "icon",
                  title: "Icon Emoji",
                  type: "string",
                }),
                defineField({
                  name: "title",
                  title: "Feature Title",
                  type: "string",
                }),
                defineField({
                  name: "description",
                  title: "Feature Description",
                  type: "text",
                }),
              ],
            }),
          ],
        }),
        defineField({ name: "image", title: "Image", type: "image" }),
      ],
    }),
  ],
});
