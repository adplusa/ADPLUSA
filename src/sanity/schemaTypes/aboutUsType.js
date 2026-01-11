import { defineType, defineField } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    // 1️⃣ SEO
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

    // 2️⃣ Main intro / hero
    defineField({
      name: "allowLightHeading",
      title: "Light Background Heading",
      type: "string",
    }),
    defineField({
      name: "allowUsHeading",
      title: "Allow Us Heading",
      type: "string",
    }),
    defineField({
      name: "allowRightHeading",
      title: "Right Heading",
      type: "string",
    }),
    defineField({
      name: "paragraph",
      title: "Paragraph",
      type: "array",
      of: [{ type: "block" }],
    }),

    // 3️⃣ Anchor links (for nav scroll)
    defineField({
      name: "anchorLinks",
      title: "Anchor Links",
      description: "Navigation anchors: People, Place, Process, Practice",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Link Label", type: "string" },
            { name: "targetId", title: "Target Section ID", type: "string" },
          ],
        },
      ],
    }),

    // 4️⃣ Dynamic Sections
    defineField({
      name: "sections",
      title: "Sections",
      description: "Flexible section blocks with title, content, image",
      type: "array",
      of: [
        {
          type: "object",
          name: "aboutSection",
          title: "About Section",
          fields: [
            {
              name: "sectionId",
              title: "Section ID (for anchor)",
              type: "string",
            },
            { name: "title", title: "Section Title", type: "string" },
            { name: "body", title: "Section Content", type: "text" },
            {
              name: "image",
              title: "Section Image",
              type: "image",
              options: { hotspot: true },
            },
            {
              name: "imageDarkMode",
              title: "Section Image for Dark Mode",
              type: "image",
              options: { hotspot: true },
            },
          ],
        },
      ],
    }),
  ],
});
