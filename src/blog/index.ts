import metadata from "~blog/metadata.yml";
import startBlog from "./2019/start-blog.md";
import typeCompatibilityInTypeScript from "./2019/type-compatibility-in-typescript.md";
import webpackOnRails from "./2019/webpack-on-rails.md";

const contents = [startBlog, typeCompatibilityInTypeScript, webpackOnRails];

export const blogs = metadata.map((meta, index) => ({ ...meta, content: contents[index] }));
