/* eslint-disable camelcase, import/order */
import blog_2019_01 from "./2019/start-blog.md";
import blog_2019_02 from "./2019/type-compatibility-in-typescript.md";
import blog_2019_03 from "./2019/webpack-on-rails.md";
import blog_2019_04 from "./2019/spa-redirect-settings-on-netlify.md";
import blog_2019_05 from "./2019/create-pull-request-on-command-line.md";
import blog_2020_01 from "./2020/using-nvm-on-github-actions.md";
import blog_2020_02 from "./2020/rubykaigi-takeout-2020.md";
import blog_2020_03 from "./2020/rubykaigi-takeout-2020-2.md";
import blog_2020_04 from "./2020/example-of-type-checking-by-steep.md";
import blog_2021_01 from "./2021/parcel-to-webpack.md";
import metadata from "./metadata.json";
/* eslint-enable import/order */

const contents = [
  blog_2019_01,
  blog_2019_02,
  blog_2019_03,
  blog_2019_04,
  blog_2019_05,
  blog_2020_01,
  blog_2020_02,
  blog_2020_03,
  blog_2020_04,
  blog_2021_01,
];
/* eslint-enable camelcase */

export const blogs = metadata.map((meta, index, array) => {
  const prev = array[index - 1];
  const next = array[index + 1];
  return {
    ...meta,
    content: contents[index],
    path: `/blog/${meta.slug}`,
    prev: prev != null ? { path: `/blog/${prev.slug}`, title: prev.title } : null, // eslint-disable-line @typescript-eslint/no-unnecessary-condition
    next: next != null ? { path: `/blog/${next.slug}`, title: next.title } : null, // eslint-disable-line @typescript-eslint/no-unnecessary-condition
  };
});
