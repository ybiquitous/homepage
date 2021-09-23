import metadata from "./metadata.json";

/**
 * @param {string} slug
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
const content = async (slug) => import(`./${slug}.md`).then((module) => module.default);

/**
 * @param {{ slug: string, title: string, published: string | null }} navi
 */
const buildNavi = ({ slug, title, published }) => {
  return published != null ? { path: `/blog/${slug}`, title } : null;
};

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- False positive.
export const blogs = metadata.map((meta, index, array) => {
  const prev = array[index - 1];
  const next = array[index + 1];
  return {
    ...meta,
    content,
    path: `/blog/${meta.slug}`,
    prev: prev != null ? buildNavi(prev) : null, // eslint-disable-line @typescript-eslint/no-unnecessary-condition
    next: next != null ? buildNavi(next) : null, // eslint-disable-line @typescript-eslint/no-unnecessary-condition
  };
});
