import startBlog from "./2019/start-blog.md";
import typeCompatibilityInTypeScript from "./2019/type-compatibility-in-typescript.md";
import webpackOnRails from "./2019/webpack-on-rails.md";
import spaRedirectOnNetlify from "./2019/spa-redirect-settings-on-netlify.md";
import metadata from "~blog/metadata.yml";

const contents = [startBlog, typeCompatibilityInTypeScript, webpackOnRails, spaRedirectOnNetlify];

export const blogs = metadata.map((meta, index) => ({ ...meta, content: contents[index] }));
