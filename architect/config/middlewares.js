module.exports = [
  "strapi::logger",
  "strapi::errors",
  "strapi::security",
  // 'strapi::cors',
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      headers: "*",
      origin: ["https://architect-sigma.vercel.app/", "http://localhost:3000"],
    },
  },
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
