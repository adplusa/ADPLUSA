export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-03-30";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

if (!projectId) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID in environment variables."
  );
}

if (!dataset) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_DATASET in environment variables."
  );
}
