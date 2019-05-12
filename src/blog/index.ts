import metadata from "~blog/metadata.yml";
import startBlog from "./start-blog.md";

const contents = [startBlog];

export const blogs = metadata.map((meta, index) => ({ ...meta, content: contents[index] }));
