import { defineField, defineType } from "sanity";

export const eventType = defineType({
  name: "homepage",
  title: "Homepage",
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

    // Animate Slider
    {
      name: "title",
      title: "Slider Title",
      type: "string",
      description: "Internal title for the slider document",
    },
    // Ligh Mode Slides
    {
      name: "slides", // ✅ not "banners"
      title: "Slides For Light Mode",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "image",
              title: "Slide Image",
              type: "image",
              options: { hotspot: true },
              fields: [{ name: "alt", title: "Alt Text", type: "string" }],
            },
          ],
        },
      ],
    },
    // Dark Mode slides
    {
      name: "slidesDarkMode", // ✅ not "banners"
      title: "Slides For Dark Mode",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "image",
              title: "Slide Image",
              type: "image",
              options: { hotspot: true },
              fields: [{ name: "alt", title: "Alt Text", type: "string" }],
            },
          ],
        },
      ],
    },

    // Trust Icons
    defineField({
      name: "trustIconsHeading",
      title: "Trust Icon Heading",
      type: "string",
    }),
    defineField({
      name: "serviceRelatedIcon",
      title: "Trust icons and text",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "serviceRelatedImg",
              title: "Service Related Img",
              type: "image",
            },

            {
              name: "serviceRelatedNumber",
              title: "Service Related Number",
              type: "string",
            },

            {
              name: "serviceRelatedName",
              title: "Service Related Name",
              type: "string",
            },
          ],
        },
      ],
    }),

    // Services
    defineField({
      name: "serviceHeading",
      title: "Service Heading",
      type: "string",
    }),
    defineField({
      name: "serviceBox",
      title: "Service Box",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "boxUrl",
              title: "Service Box URL",
              type: "string", // ✅ change from "url" to "string"
              validation: (Rule) =>
                Rule.required().custom((url) => {
                  return url.startsWith("/") || "Must start with /";
                }),
            },
            {
              name: "serviceBoxImg",
              title: "Service Box Img",
              type: "image",
            },
            {
              name: "serviceBoxTitle",
              title: "Service Box Title",
              type: "string",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "home_services_cta",
      title: "Service CTA",
      type: "string",
    }),

    // Technology We used
    defineField({
      name: "technologyHeading",
      title: "Technology Heading",
      type: "string",
    }),
    defineField({
      name: "technologyImgs",
      title: "Technology used images",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "technologyImage",
              title: "Image",
              type: "image",
              options: {
                hotspot: true,
              },
            },
          ],
          preview: {
            select: {
              media: "technologyImage",
            },
          },
        },
      ],
    }),

    // Working Process
    defineField({
      name: "workingProcessHeading",
      title: "Working Process Heading",
      type: "string",
    }),
    defineField({
      name: "workingProcessSubHeading",
      title: "Working Process Sub Heading",
      type: "string",
    }),
    defineField({
      name: "processSteps",
      title: "Process Steps",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "stepTitle",
              title: "Step Title",
              type: "string",
            },
            {
              name: "stepText",
              title: "Step Description",
              type: "text",
            },
            {
              name: "stepImage",
              title: "Step Image",
              type: "image",
              options: {
                hotspot: true,
              },
            },
          ],
        },
      ],
    }),

    // TEXT SLIDER
    defineField({
      name: "sliderImage",
      title: "Slider Icon/Image",
      type: "image",
      description:
        "Optional image that appears after each text item in the marquee",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "sliderTextOne",
      title: "Slider Text One",
      type: "string",
      description: "First line of text for the scrolling marquee",
    }),
    defineField({
      name: "sliderTextTwo",
      title: "Slider Text Two",
      type: "string",
      description: "Second line of text for the scrolling marquee",
    }),
    defineField({
      name: "sliderTextThree",
      title: "Slider Text Three",
      type: "string",
      description: "Third line of text for the scrolling marquee",
    }),
    defineField({
      name: "sliderTextFour",
      title: "Slider Text Four",
      type: "string",
      description: "Four line of text for the scrolling marquee",
    }),
    defineField({
      name: "sliderTextFive",
      title: "Slider Text Five",
      type: "string",
      description: "Five line of text for the scrolling marquee",
    }),

    // FAQ Section
    // defineField({
    //   name: "faqHeading",
    //   title: "Faq Heading",
    //   type: "string",
    // }),
    // defineField({
    //   name: "faq",
    //   title: "FAQ",
    //   type: "array",
    //   of: [
    //     {
    //       name: "faqItems",
    //       type: "object",
    //       fields: [
    //         {
    //           name: "question",
    //           title: "Question",
    //           type: "string",
    //         },
    //         {
    //           name: "answer",
    //           title: "Answer",
    //           type: "string",
    //         },
    //       ],
    //     },
    //   ],
    // }),

    // About-us Section
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
      title: "paragraph",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "ctaButton",
      title: "Button for About us Redirection section",
      type: "string",
    }),
    defineField({
      name: "peoplImageOne",
      title: "People Image One",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "peoplImageTwo",
      title: "People Image Two",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "peopleVideo",
      title: "People Video",
      type: "file",
      options: {
        accept: "video/*",
      },
    }),
    defineField({
      name: "peopleText",
      title: "People Image Text",
      type: "string",
    }),

    defineField({
      name: "founderSlider",
      title: "Founder Slider",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "founderTitle",
              title: "Founder Title",
              type: "string",
            },
            {
              name: "founderDescription",
              title: "Founder Description",
              type: "array",
              of: [{ type: "block" }],
            },
            {
              name: "founderDescriptionTwo",
              title: "Founder Description",
              type: "array",
              of: [{ type: "block" }],
            },
            {
              name: "founderName",
              title: "Founder Name",
              type: "string",
            },
            {
              name: "founderAchievements",
              title: "Founder Achievements",
              type: "string",
            },
            {
              name: "partnerLabel",
              title: "Partner Label",
              type: "string",
            },
            {
              name: "partner",
              title: "Partner Content",
              type: "string",
            },
            {
              name: "image", // ✅ Add this field
              title: "Founder Image",
              type: "image",
              options: {
                hotspot: true,
              },
            },
          ],
        },
      ],
    }),

    // defineField({
    //   name: "slideImage",
    //   title: "Slide Image",
    //   type: "image",
    //   options: {
    //     hotspot: true,
    //   },
    // }),

    // Contact us
    defineField({
      name: "contactUsSectionImg",
      title: "Contact Us Section Image",
      type: "image",
    }),
    //
    defineField({
      name: "contactUsTitle",
      title: "Contact Us Title",
      type: "string",
    }),
    defineField({
      name: "contactUsButton",
      title: "Contact Us Button",
      type: "string",
    }),
  ],
});
