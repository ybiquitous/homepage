import { uniqueArray } from "../utils/uniqueArray.js";
import metadata from "./metadata.json";

/**
 * @typedef {{
 *   slug: string,
 *   title: string,
 *   published: string | null,
 *   lastUpdated: string | null
 *   author: string,
 *   tags: ReadonlyArray<string>,
 * }} BlogMeta
 */

/**
 * @param {string} slug
 * @returns {Promise<string>}
 */
const content = async (slug) =>
  import(`./${slug}.md`).then((module) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const c = module.default;
    if (typeof c === "string") {
      return c;
    }
    throw new TypeError(`Unknown slug: "${slug}"`);
  });

/**
 * @typedef {{
 *   path: string,
 *   title: string,
 * }} PathInfo
 */

/**
 * @param {Readonly<BlogMeta>} navi
 * @returns {PathInfo | null}
 */
const buildNavi = ({ slug, title, published }) =>
  published == null ? null : { path: `/blog/${slug}`, title };

/**
 * @typedef {BlogMeta & {
 *   content: (slug: string) => Promise<string>,
 *   path: string,
 *   prev: PathInfo | null,
 *   next: PathInfo | null,
 * }} Blog
 */

/**
 * @type {ReadonlyArray<Blog>}
 */
export const blogs = metadata.map((meta, index, array) => {
  const prev = index === 0 ? null : array[index - 1];
  const next = index === array.length - 1 ? null : array[index + 1];
  return {
    ...meta,
    content,
    path: `/blog/${meta.slug}`,
    prev: prev == null ? null : buildNavi(prev),
    next: next == null ? null : buildNavi(next),
  };
});

/**
 * @param {ReadonlyArray<Blog>} originalBlogs
 * @returns {Map<string, Array<Blog>>}
 */
export const blogsByTag = (originalBlogs) => {
  return uniqueArray(originalBlogs.flatMap((b) => b.tags)).reduce(
    (/** @type {Map<string, Array<Blog>>} */ map, tag) => {
      const filteredBlogs = map.get(tag) ?? [];
      for (const blog of originalBlogs.filter((b) => b.tags.includes(tag))) {
        filteredBlogs.push(blog);
      }
      map.set(tag, filteredBlogs);
      return map;
    },
    new Map()
  );
};
