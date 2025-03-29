import { defineField, defineType } from "sanity";

// export const eventType = defineType({
//   name: "homepage",
//   title: "Homepage",
//   type: "document",
//   fields: [
//     defineField({
//       name: "name",
//       title: "Name",
//       type: "string",
//     }),
//   ],
// });

export const homepage = {
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    // other fields you may have like 'heroSubtitle', etc.
  ],
};
