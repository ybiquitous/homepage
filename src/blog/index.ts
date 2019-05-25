import metadata from "~blog/metadata.yml";
import startBlog from "./2019/start-blog.md";
import typeCompatibilityInTypescript from "./2019/type-compatibility-in-typescript.md";

const contents = [startBlog, typeCompatibilityInTypescript];

export const blogs = metadata.map((meta, index) => ({ ...meta, content: contents[index] }));
