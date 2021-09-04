import metadata from "./metadata.json";

/**
 * @param {string} slug
 */
const content = (slug) => import(`./${slug}.md`).then((module) => module.default);

export const blogs = metadata.map((meta, index, array) => {
  const prev = array[index - 1];
  const next = array[index + 1];
  return {
    ...meta,
    content,
    path: `/blog/${meta.slug}`,
    prev: prev != null ? { path: `/blog/${prev.slug}`, title: prev.title } : null, // eslint-disable-line @typescript-eslint/no-unnecessary-condition
    next: next != null ? { path: `/blog/${next.slug}`, title: next.title } : null, // eslint-disable-line @typescript-eslint/no-unnecessary-condition
  };
});
