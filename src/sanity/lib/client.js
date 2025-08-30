import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId: "5ippxm43",
  dataset: "production",
  apiVersion,
  // useCdn: true,
  // token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false, // set false if you need fresh data with token
  // token,
});
