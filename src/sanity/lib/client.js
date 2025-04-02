import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId: "6ntfz2x8",
  dataset: "production",
  apiVersion,
  useCdn: true,
});
