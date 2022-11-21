import { uniqueArray } from "../utils/uniqueArray.js";
import metadata from "./metadata.js";

/**
 * @typedef {Readonly<{
 *   slug: string,
 *   title: string,
 *   published: string | null,
 *   lastUpdated: string | null
 *   author: string,
 *   tags: ReadonlyArray<string>,
 * }>} BlogMeta
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
 * @typedef {Readonly<{
 *   path: string,
 *   title: string,
 * }>} PathInfo
 */

/**
 * @param {BlogMeta} navi
 * @returns {PathInfo | null}
 */
const buildNavi = ({ slug, title, published }) =>
  published == null ? null : { path: `/blog/${slug}`, title };

/**
 * @typedef {Readonly<{
 *   slug: string,
 *   title: string,
 *   author: string,
 *   tags: ReadonlyArray<string>,
 *   published: Date | null,
 *   lastUpdated: Date | null
 *   content: (slug: string) => Promise<string>,
 *   path: string,
 *   prev: PathInfo | null,
 *   next: PathInfo | null,
 * }>} Blog
 */

/**
 * @type {ReadonlyArray<Blog>}
 */
export const blogs = metadata.map((meta, index, array) => {
  const { slug, title, author, tags, published, lastUpdated } = meta;
  const prev = array[index - 1];
  const next = array[index + 1];
  return {
    slug,
    title,
    author,
    tags,
    published: typeof published === "string" ? new Date(published) : published,
    lastUpdated: typeof lastUpdated === "string" ? new Date(lastUpdated) : lastUpdated,
    content,
    path: `/blog/${slug}`,
    prev: prev ? buildNavi(prev) : null,
    next: next ? buildNavi(next) : null,
  };
});

/**
 * @param {ReadonlyArray<Blog>} originalBlogs
 * @returns {Map<string, Array<Blog>>}
 */
export const blogsByTag = (originalBlogs) => {
  /** @type {Map<string, Array<Blog>>} */
  const map = new Map();

  for (const tag of uniqueArray(originalBlogs.flatMap((b) => b.tags))) {
    const filteredBlogs = map.get(tag) ?? [];
    for (const blog of originalBlogs.filter((b) => b.tags.includes(tag))) {
      filteredBlogs.push(blog);
    }
    map.set(tag, filteredBlogs);
  }

  return map;
};
