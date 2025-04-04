import { defineField, defineType } from "sanity";

export const eventType = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "lightModeImage",
      title: "Light Mode Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "darkModeImage",
      title: "Dark Mode Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

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
      name: "bulletPoints",
      title: "Bullet Points",
      type: "array",
      of: [{ type: "string" }],
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
      name: "ctaButton",
      title: "Button for About us Redirection section",
      type: "string",
    }),

    defineField({
      name: "sliderTextOne",
      title: "Slider Text One",
      type: "string",
    }),

    defineField({
      name: "sliderTextTwo",
      title: "Slider Text Two",
      type: "string",
    }),

    defineField({
      name: "serviceSmallHeading",
      title: "Service Small Heading",
      type: "string",
    }),

    defineField({
      name: "serviceBigHeading",
      title: "Service Big Heading",
      type: "string",
    }),

    defineField({
      name: "services", // Name of the array
      title: "Services",
      type: "array", // Array type to store multiple services
      of: [
        {
          type: "object", // Each service will be an object
          fields: [
            {
              name: "serviceTitle", // Title of the service
              type: "string",
              title: "Service Title",
            },
            {
              name: "serviceImage", // Image for the service
              type: "image",
              title: "Service Image",
              options: {
                hotspot: true, // Enables hotspot for cropping and resizing
              },
            },
            {
              name: "serviceContent", // Content/Description of the service
              type: "text",
              title: "Service Content",
            },
          ],
        },
      ],
    }),

    defineField({
      name: "trustIconsHeading",
      title: "Trust Icon Heading",
      type: "string",
    }),

    // Trust Icons
    defineField({
      name: "serviceRelatedIcon",
      title: "Service Related icons and text",
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

    // Client reviews (Trust icon)
    defineField({
      name: "clientReviews",
      title: "Cleint Reviews",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "clientReviewTitle",
              title: "Client Review Title",
              type: "string",
            },
            {
              name: "clientReviewNumber",
              title: "Client Review Number",
              type: "string",
            },
            {
              name: "clientReviewImg",
              title: "Client Review Image",
              type: "image",
            },
          ],
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

    // Process Steps
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
  ],
});
