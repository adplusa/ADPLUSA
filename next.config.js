module.exports = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
};

// module.exports = {
//   env: {
//     NEXT_PUBLIC_API_BASE_URL:
//       process.env.NEXT_PUBLIC_API_BASE_URL
//   },
//   webpack: (config, { dev }) => {
//     console.log("🚀 NODE_ENV:", process.env.NODE_ENV);
//     console.log("🚀 API BASE URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
//     return config;
//   },
// };
