// module.exports = {
//   env: {
//     NEXT_PUBLIC_API_BASE_URL:
//       process.env.NEXT_PUBLIC_API_BASE_URL ||
//       "https://architect-3cto.onrender.com",
//   },
// };

module.exports = {
  env: {
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://architect-3cto.onrender.com",
  },
  webpack: (config, { dev }) => {
    console.log("🚀 NODE_ENV:", process.env.NODE_ENV);
    console.log("🚀 API BASE URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
    return config;
  },
};
