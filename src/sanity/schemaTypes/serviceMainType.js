import { defineField, defineType } from "sanity";

export const mainServiceType = defineType({
  name: "serviceTwoPage",
  title: "Service Main Page",
  type: "document",
  fields: [
    // ✅ SEO Meta
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

    // ✅ Main Title
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
    }),

    // ✅ Hero Banner
    defineField({
      name: "serviceBannerImage",
      title: "Banner Image",
      type: "image",
      options: { hotspot: true },
    }),

    // ✅ Trust Section
    // defineField({
    //   name: "trustSection",
    //   title: "Trust Section",
    //   type: "object",
    //   fields: [
    //     defineField({ name: "title", title: "Title", type: "string" }),
    //     defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
    //   ],
    // }),

    // ✅ Trust Icons Grid
    // defineField({
    //   name: "trustIconsHeading",
    //   title: "Trust Icons Heading",
    //   type: "string",
    // }),
    // defineField({
    //   name: "serviceRelatedIcon",
    //   title: "Service Related Icons",
    //   type: "array",
    //   of: [
    //     {
    //       type: "object",
    //       fields: [
    //         defineField({
    //           name: "serviceRelatedImg",
    //           title: "Icon Image",
    //           type: "image",
    //         }),
    //         defineField({
    //           name: "serviceRelatedNumber",
    //           title: "Number",
    //           type: "string",
    //         }),
    //         defineField({
    //           name: "serviceRelatedName",
    //           title: "Name",
    //           type: "string",
    //         }),
    //       ],
    //     },
    //   ],
    // }),

    // ✅ Services Boxes
    // defineField({
    //   name: "serviceHeading",
    //   title: "Service Heading",
    //   type: "string",
    // }),
    // defineField({
    //   name: "serviceBox",
    //   title: "Service Boxes",
    //   type: "array",
    //   of: [
    //     {
    //       type: "object",
    //       fields: [
    //         {
    //           name: "boxUrl",
    //           title: "Service Box URL",
    //           type: "string",
    //           validation: (Rule) =>
    //             Rule.required().custom((url) =>
    //               url.startsWith("/") ? true : "Must start with /"
    //             ),
    //         },
    //         {
    //           name: "serviceBoxImg",
    //           title: "Service Box Image",
    //           type: "image",
    //         },
    //         {
    //           name: "serviceBoxTitle",
    //           title: "Service Box Title",
    //           type: "string",
    //         },
    //       ],
    //     },
    //   ],
    // }),

    // ✅ Why Work With Us
    defineField({
      name: "whyWorkWithUs",
      title: "Why Work With Us",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({
          name: "features",
          title: "Features",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
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
            },
          ],
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
        }),
      ],
    }),
  ],
});
