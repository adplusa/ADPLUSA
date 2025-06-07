import { defineType, defineField } from "sanity";

export const faqSection = defineType({
  name: "faqSection",
  title: "FAQ Section",
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
      title: "Page Title",
      type: "string",
      initialValue: "Frequently Asked Questions",
    }),

    defineField({
      name: "categories",
      title: "FAQ Categories",
      type: "array",
      of: [
        defineField({
          type: "object",
          name: "faqCategory",
          title: "FAQ Category",
          fields: [
            defineField({
              name: "title",
              title: "Category Title",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Category Description",
              type: "text",
            }),
            defineField({
              name: "chatLink",
              title: "Chat Link URL",
              type: "url",
              initialValue: "/contact",
              description: "Optional link to contact or chat support page",
            }),
            defineField({
              name: "image",
              title: "Category Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "faqs",
              title: "FAQs",
              type: "array",
              of: [
                defineField({
                  type: "object",
                  name: "faqItem",
                  title: "FAQ Item",
                  fields: [
                    defineField({
                      name: "icon",
                      title: "Icon Keyword",
                      type: "string",
                      description: "e.g. heart, refresh, calendar, globe etc.",
                    }),
                    defineField({
                      name: "question",
                      title: "Question",
                      type: "string",
                    }),
                    defineField({
                      name: "answer",
                      title: "Answer",
                      type: "text",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
});
