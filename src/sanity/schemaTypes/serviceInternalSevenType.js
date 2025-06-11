export default {
  name: "serviceInternalSevenPage",
  title: "Services Internal Page Seven",
  type: "document",
  fields: [
    {
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
    },
    {
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
    },
    {
      name: "serviceBannerImage",
      title: "Banner Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "servicesList",
      title: "Services List",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "description", title: "Description", type: "text" },
            {
              name: "image",
              title: "Service Image",
              type: "image",
              options: { hotspot: true },
            },
          ],
        },
      ],
    },
    {
      name: "keyActivities",
      title: "Key Activities and Outcomes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "description", title: "Description", type: "text" },
          ],
        },
      ],
    },
    {
      name: "reasonsToWork",
      title: "Reasons to Work With Us",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Reason Title", type: "string" },
            { name: "description", title: "Reason Description", type: "text" },
          ],
        },
      ],
    },
    {
      name: "founderImage",
      title: "Image for 'Why Work With Us' Section",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "professionals",
      title: "Explore More Services - Professionals Carousel",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Professional Title", type: "string" },
            {
              name: "image",
              title: "Professional Image",
              type: "image",
              options: { hotspot: true },
            },
          ],
        },
      ],
    },
  ],
};
