import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env.js";

console.log("Sanity projectId:", projectId, "dataset:", dataset);

export const client = createClient({
  projectId,
  dataset,
  apiVersion,

  useCdn: false, // set false if you need fresh data with token
});
