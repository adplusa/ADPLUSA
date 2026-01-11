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
    defineField({
      name: "serviceBannerImageDarkMode",
      title: "Banner Image for Dark Mode",
      type: "image",
      options: { hotspot: true },
    }),

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
        defineField({
          name: "imageDarkMode",
          title: "Image for Dark Mode",
          type: "image",
        }),
      ],
    }),
  ],
});
