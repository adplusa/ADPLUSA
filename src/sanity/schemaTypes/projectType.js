// schemas/projectPage.ts (or .js)
import { defineField, defineType } from "sanity";

export const projectPage = defineType({
  name: "projectPage",
  title: "Project Page",
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

    // Heading
    defineField({
      name: "heading",
      title: "Main Heading",
      type: "string",
    }),

    // Project Grid Section
    defineField({
      name: "projects",
      title: "Project Grid",
      type: "array",
      of: [
        defineField({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Project Title",
              type: "string",
            }),
            defineField({
              name: "image",
              title: "Project Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "slug",
              title: "Slug",
              type: "slug",
              options: {
                source: "title",
                maxLength: 96,
              },
            }),
            defineField({
              name: "link",
              title: "Project Link",
              type: "url",
              validation: (Rule) =>
                Rule.uri({
                  allowRelative: true,
                  scheme: ["http", "https"],
                }),
            }),
          ],
        }),
      ],
    }),
  ],
});
