export function generateSlug(title: string): string {
    if (!title) return "";
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric characters except spaces and hyphens
        .replace(/\s+/g, "-") // replace spaces with hyphens
        .replace(/-+/g, "-") // replace multiple hyphens with a single one
        .trim(); // trim leading/trailing spaces
}