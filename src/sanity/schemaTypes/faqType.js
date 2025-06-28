// schemas/faqSection.js (or .ts)

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
          name: "faqCategory",
          title: "FAQ Category",
          type: "object",
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
            // defineField({
            //   name: "chatLink",
            //   title: "Chat Link URL",
            //   type: "url",
            //   description: "Link to chat or contact page",
            //   initialValue: "/contact",
            // }),
            defineField({
              name: "chatLink",
              title: "Chat Link URL",
              type: "string",
              description: "Link to chat or contact page",
              initialValue: "/contact",
            }),

            defineField({
              name: "image",
              title: "Category Image",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "imageDarkMode",
              title: "Category Image for Dark Mode",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "faqs",
              title: "FAQs",
              type: "array",
              of: [
                defineField({
                  name: "faqItem",
                  title: "FAQ Item",
                  type: "object",
                  fields: [
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

export default faqSection;
