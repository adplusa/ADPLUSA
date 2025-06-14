import { defineType, defineField } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
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

    // Contact Form Configuration
    // defineField({
    //   name: "formFields",
    //   title: "Form Fields",
    //   type: "array",
    //   of: [
    //     defineField({
    //       type: "object",
    //       name: "formField",
    //       title: "Form Field",
    //       fields: [
    //         defineField({ name: "label", title: "Label", type: "string" }),
    //         defineField({ name: "name", title: "Field Name", type: "string" }),
    //         defineField({
    //           name: "type",
    //           title: "Field Type",
    //           type: "string",
    //           options: {
    //             list: ["text", "email", "textarea", "checkbox"],
    //           },
    //         }),
    //         defineField({
    //           name: "required",
    //           title: "Required",
    //           type: "boolean",
    //           initialValue: true,
    //         }),
    //       ],
    //     }),
    //   ],
    // }),
    // Contact Form Configuration
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
                list: ["text", "email", "phone", "textarea", "checkbox"], // added "phone"
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

    // Hero section / heading
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

    // Google Map
    defineField({
      name: "googleMapEmbedUrl",
      title: "Google Map Embed URL",
      type: "url",
      description: "Paste the embed iframe URL (only the src part)",
    }),

    // Additional Info Section
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
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
            }),
          ],
        }),
      ],
    }),

    // Optional Section with Image
    defineField({
      name: "rightImage",
      title: "Right Section Image",
      type: "image",
      options: { hotspot: true },
    }),

    // WhatsApp CTA Button
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp Number",
      type: "string",
    }),
    defineField({
      name: "whatsappText",
      title: "WhatsApp Pre-filled Text",
      type: "string",
    }),

    // Enquiry Button
    defineField({
      name: "enquiryButtonText",
      title: "Enquiry Button Text",
      type: "string",
      initialValue: "Enquire Now",
    }),

    // Optional Upward Arrow Scroll Element
    defineField({
      name: "showScrollToTop",
      title: "Enable Scroll-to-Top Button",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
