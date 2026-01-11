// schemas/projectPage.js (or .ts)

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
    defineField({
      name: "heading",
      title: "Main Heading",
      type: "string",
    }),
    defineField({
      name: "projects",
      title: "Projects Grid",
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
              name: "link",
              title: "Project Link",
              type: "url",
              description: "Can be internal or external URL",
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

export default projectPage;
