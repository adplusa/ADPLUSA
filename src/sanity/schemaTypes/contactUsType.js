// /schemas/contactPage.js
import { defineType, defineField } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    // SEO
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

    // Contact Form Fields
    defineField({
      name: "formFields",
      title: "Form Fields",
      type: "array",
      of: [
        defineField({
          type: "object",
          name: "formField",
          title: "Form Field",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "name", title: "Field Name", type: "string" }),
            defineField({
              name: "type",
              title: "Field Type",
              type: "string",
              options: {
                list: ["text", "email", "phone", "textarea", "checkbox"],
              },
            }),
            defineField({
              name: "required",
              title: "Required",
              type: "boolean",
              initialValue: true,
            }),
          ],
        }),
      ],
    }),

    // Main Hero
    defineField({
      name: "mainHeading",
      title: "Main Heading",
      type: "string",
      description: "Main title on the contact page (e.g., 'Get in touch')",
    }),
    defineField({
      name: "contactImage",
      title: "Contact Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "introText",
      title: "Introductory Text",
      type: "array",
      of: [{ type: "block" }],
    }),

    // Contact Info Block
    defineField({
      name: "contactInfo",
      title: "Contact Information",
      type: "object",
      fields: [
        defineField({
          name: "address",
          title: "Address",
          type: "string",
        }),
        defineField({
          name: "phone",
          title: "Phone Number",
          type: "string",
        }),
        defineField({
          name: "email",
          title: "Email Address",
          type: "string",
        }),
      ],
    }),

    // Google Map Embed
    defineField({
      name: "googleMapEmbedUrl",
      title: "Google Map Embed URL",
      type: "url",
      description: "Paste only the iframe `src` URL here.",
    }),

    // Why Work With Us
    defineField({
      name: "whyWorkWithUsHeading",
      title: "Why Work With Us - Heading",
      type: "string",
    }),
    defineField({
      name: "whyWorkWithUsItems",
      title: "Why Work With Us - Items",
      type: "array",
      of: [
        defineField({
          type: "object",
          name: "feature",
          fields: [
            defineField({
              name: "icon",
              title: "Icon (Emoji or Text)",
              type: "string",
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
            }),
          ],
        }),
      ],
    }),

    // Optional Right Section Image
    defineField({
      name: "rightImage",
      title: "Right Section Image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});
