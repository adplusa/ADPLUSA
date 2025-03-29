import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "ibh6cco0", // Replace with your actual Project ID
  dataset: "production", // or your dataset name
  apiVersion: "2025-03-27", // Use the latest date
  useCdn: true, // `true` for faster responses, `false` for fresh data
});
