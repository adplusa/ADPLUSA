import { defineField, defineType } from "sanity";

export const eventType = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    // Image for Light and Dark Mode
    defineField({
      name: "lightModeImage",
      title: "Banner Image for Light Mode",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "darkModeImage",
      title: "Banner Image for Dark Mode",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

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
    defineField({
      name: "sectionTitle",
      title: "Achievement Title",
      type: "string",
    }),
    defineField({
      name: "achievements",
      title: "Achievements",
      type: "array",
      of: [
        {
          type: "object",
          name: "achievementCard",
          title: "Achievement Card",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "number",
              title: "Number",
              type: "string",
              description: 'Use string to allow characters like "+"',
            }),
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
              type: "url",
              validation: (Rule) =>
                Rule.uri({
                  scheme: ["http", "https", "mailto", "tel"],
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
    // defineField({
    //   name: "sliderTextOne",
    //   title: "Slider Text One",
    //   type: "string",
    // }),
    // defineField({
    //   name: "sliderTextTwo",
    //   title: "Slider Text Two",
    //   type: "string",
    // }),
    // {
    //   name: "sliderImage",
    //   title: "Slider Image",
    //   type: "image",
    // },
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
      name: "sliderImage",
      title: "Slider Icon/Image",
      type: "image",
      description:
        "Optional image that appears after each text item in the marquee",
      options: {
        hotspot: true,
      },
    }),

    // FAQ Section
    defineField({
      name: "faqHeading",
      title: "Faq Heading",
      type: "string",
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [
        {
          name: "faqItems",
          type: "object",
          fields: [
            {
              name: "question",
              title: "Question",
              type: "string",
            },
            {
              name: "answer",
              title: "Answer",
              type: "string",
            },
          ],
        },
      ],
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
        },
      ],
    }),

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

    //Founder Slider
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
              name: "founderThumbnailImage",
              title: "Founder Thumbnail Image",
              type: "image",
              options: {
                hotspot: true,
              },
            },

            {
              name: "founderName",
              title: "Founder Name",
              type: "string",
            },

            {
              name: "position",
              title: "Position",
              type: "string",
            },

            {
              name: "founderImage",
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
