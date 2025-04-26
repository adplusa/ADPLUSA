import imageUrlBuilder from "@sanity/image-url";

import { client } from "@/sanity/lib/client";

const builder = imageUrlBuilder(client);

function urlFor(source) {
  return builder.image(source);
}

export default urlFor;
