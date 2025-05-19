import { defineType, defineField } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "mainTitle",
      title: "Main Title",
      type: "string",
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "string",
    }),
    defineField({
      name: "introParagraphs",
      title: "Introduction Paragraphs",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "anchorLinks",
      title: "Anchor Links",
      type: "array",
      of: [
        defineField({
          type: "object",
          fields: [
            { name: "label", title: "Link Label", type: "string" },
            { name: "targetId", title: "Target Section ID", type: "string" },
          ],
        }),
      ],
      description: "Navigation anchors: People, Place, Process, Practice",
    }),

    // Section Blocks
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        defineField({
          type: "object",
          name: "aboutSection",
          title: "About Section",
          fields: [
            defineField({
              name: "title",
              title: "Section Title",
              type: "string",
            }),
            defineField({
              name: "body",
              title: "Section Content",
              type: "text",
            }),

            defineField({
              name: "image",
              title: "Section Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "sectionId",
              title: "Section ID (for anchor)",
              type: "string",
              description: "Used for in-page navigation (e.g. people-box)",
            }),
          ],
        }),
      ],
    }),

    // Optional WhatsApp / Enquiry Button text (if needed)
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp Number",
      type: "string",
      description: "WhatsApp number with country code",
    }),
    defineField({
      name: "whatsappText",
      title: "WhatsApp Default Message",
      type: "string",
    }),
    defineField({
      name: "enquiryButtonText",
      title: "Enquiry Button Text",
      type: "string",
      initialValue: "Enquire Now",
    }),

    // Optional rotating element (if needed)
    defineField({
      name: "rotatingText",
      title: "Rotating Text",
      type: "string",
      description: "Optional animated text for decoration",
    }),
  ],
});
