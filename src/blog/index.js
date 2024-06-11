import { assert } from "../utils/assert.js";
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
 * @param {string | null} value
 * @returns {Date | null}
 */
const parseDate = (value) => (typeof value === "string" ? new Date(value) : value);

/**
 * @typedef {Readonly<{
 *   slug: string,
 *   year: number,
 *   title: string,
 *   author: string,
 *   tags: ReadonlyArray<string>,
 *   published: Date | null,
 *   lastUpdated: Date | null
 *   content: (slug: string) => Promise<string>,
 *   path: string,
 *   prev: PathInfo | null,
 *   next: PathInfo | null,
 * }>} BlogPost
 */

/**
 * @type {ReadonlyArray<BlogPost>}
 */
export const blogPosts = metadata.map((meta, index, array) => {
  const { slug, title, author, tags, published, lastUpdated } = meta;

  const year = Number(slug.split("/")[0]);
  const publishedAsDate = parseDate(published);
  if (publishedAsDate) {
    assert(publishedAsDate.getFullYear() === year);
  }

  const prev = array[index - 1];
  const next = array[index + 1];

  return {
    slug,
    year,
    title,
    author,
    tags,
    published: publishedAsDate,
    lastUpdated: parseDate(lastUpdated),
    content,
    path: `/blog/${slug}`,
    prev: prev ? buildNavi(prev) : null,
    next: next ? buildNavi(next) : null,
  };
});

/**
 * @param {ReadonlyArray<BlogPost>} originalPosts
 * @returns {Map<number, Array<BlogPost>>}
 */
export const groupBlogPostsByYear = (originalPosts) => {
  /** @type {Map<number, Array<BlogPost>>} */
  const posts = new Map();

  for (const year of new Set(originalPosts.map((post) => post.year))) {
    const filteredPosts = posts.get(year) ?? [];
    posts.set(year, [...filteredPosts, ...originalPosts.filter((post) => post.year === year)]);
  }

  return posts;
};

/**
 * @param {ReadonlyArray<BlogPost>} originalPosts
 * @returns {Map<string, Array<BlogPost>>}
 */
export const groupBlogPostsByTag = (originalPosts) => {
  /** @type {Map<string, Array<BlogPost>>} */
  const posts = new Map();

  for (const tag of uniqueArray(originalPosts.flatMap(({ tags }) => tags))) {
    const filteredPosts = posts.get(tag) ?? [];
    posts.set(tag, [...filteredPosts, ...originalPosts.filter(({ tags }) => tags.includes(tag))]);
  }

  return posts;
};

export const allPostYears = uniqueArray(blogPosts.map((post) => post.year));
