// Default accepted image types
export const DEFAULT_ACCEPTED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
];

// Accepted video types
export const VIDEO_ACCEPTED_TYPES = [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
];

// All accepted media types
export const MEDIA_ACCEPTED_TYPES = [
    ...DEFAULT_ACCEPTED_TYPES,
    ...VIDEO_ACCEPTED_TYPES,
];
