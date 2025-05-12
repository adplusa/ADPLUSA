import { defineField, defineType } from "sanity";

export const serviceType = defineType({
  name: "serviceTwoPage",
  title: "Service Two Page",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({
          name: "buttonText",
          title: "Button Text",
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
    // defineField({
    //   name: "serviceRelatedHeading",
    //   title: "Service Related Heading",
    //   type: "string",
    // }),
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

    defineField({
      name: "clientReviews",
      title: "Client Reviews",
      type: "array",
      of: [
        defineField({
          type: "object",
          fields: [
            defineField({
              name: "clientReviewTitle",
              title: "Client Review Title",
              type: "string",
            }),
            defineField({
              name: "clientReviewNumber",
              title: "Client Review Number",
              type: "string",
            }),
            defineField({
              name: "gradient",
              title: "Gradient",
              type: "string",
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: "activitiesOutcomes",
      title: "Activities and Outcomes",
      type: "object",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({
          name: "subheading",
          title: "Subheading",
          type: "string",
        }),
        defineField({
          name: "cards",
          title: "Cards",
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
                defineField({ name: "title", title: "Title", type: "string" }),
                defineField({
                  name: "description",
                  title: "Description",
                  type: "text",
                }),
                defineField({
                  name: "cardlink",
                  title: "Card Link",
                  type: "string",
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: "cta",
          title: "CTA Section",
          type: "object",
          fields: [
            defineField({
              name: "buttonText",
              title: "Button Text",
              type: "string",
            }),
            defineField({ name: "image", title: "Image", type: "image" }),
          ],
        }),
      ],
    }),

    defineField({
      name: "professionals",
      title: "Professionals Carousel",
      type: "array",
      of: [
        defineField({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({
              name: "subtitle",
              title: "Subtitle",
              type: "string",
            }),
            defineField({ name: "image", title: "Image", type: "image" }),
            defineField({
              name: "bgColor",
              title: "Background Color",
              type: "string",
            }),
            defineField({
              name: "textColor",
              title: "Text Color",
              type: "string",
            }),
          ],
        }),
      ],
    }),

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
      name: "visualConcepts",
      title: "Visual Concepts Section",
      type: "array",
      of: [
        defineField({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
            }),
            defineField({ name: "image", title: "Image", type: "image" }),
          ],
        }),
      ],
    }),

    defineField({
      name: "followingSteps",
      title: "Following Steps Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
        }),
        defineField({
          name: "buttons",
          title: "Buttons",
          type: "array",
          of: [defineField({ type: "string" })],
        }),
      ],
    }),

    defineField({
      name: "finalCTA",
      title: "Final Call to Action",
      type: "object",
      fields: [
        defineField({
          name: "buttonText",
          title: "Button Text",
          type: "string",
        }),
        defineField({ name: "title", title: "Title", type: "string" }),
      ],
    }),
  ],
});
