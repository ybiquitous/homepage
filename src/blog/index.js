import metadata from "./metadata.json";

/**
 * @param {string} slug
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
const content = async (slug) => import(`./${slug}.md`).then((module) => module.default);

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- False positive.
export const blogs = metadata.map((meta, index, array) => {
  const prev = array[index - 1];
  const next = array[index + 1];
  return {
    ...meta,
    content,
    path: `/blog/${meta.slug}`,
    prev:
      prev != null && prev.published != null
        ? { path: `/blog/${prev.slug}`, title: prev.title }
        : null, // eslint-disable-line @typescript-eslint/no-unnecessary-condition
    next:
      next != null && next.published != null
        ? { path: `/blog/${next.slug}`, title: next.title }
        : null, // eslint-disable-line @typescript-eslint/no-unnecessary-condition
  };
});
