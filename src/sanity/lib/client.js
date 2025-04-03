import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId: "5ippxm43",
  dataset,
  apiVersion,
  useCdn: true,
});
