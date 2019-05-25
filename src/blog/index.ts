import metadata from "~blog/metadata.yml";
import startBlog from "./start-blog.md";
import typeCompatibilityInTypescript from "./type-compatibility-in-typescript.md";

const contents = [startBlog, typeCompatibilityInTypescript];

export const blogs = metadata.map((meta, index) => ({ ...meta, content: contents[index] }));
