// import { createClient } from "next-sanity";
// import { apiVersion, dataset, projectId } from "../env.js";

// console.log("Sanity projectId:", projectId, "dataset:", dataset);

// export const client = createClient({
//   projectId,
//   dataset,
//   apiVersion,

//   useCdn: false,
// });

import { createClient } from "next-sanity";
import { apiVersion } from "../env";

// ✅ Safely pick env vars for both server and client
const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "Sanity projectId or dataset is missing in environment variables"
  );
}

export const client = createClient({
  projectId: "5ippxm43",
  dataset: "production",
  apiVersion,
  token: process.env.SANITY_API_TOKEN,
  useCdn: process.env.NODE_ENV === "production",
});
