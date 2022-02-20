import metadata from "./metadata.json";

/**
 * @param {string} slug
 * @returns {Promise<string>}
 */
const content = async (slug) =>
  import(`./${slug}.md`).then((module) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const c = module.default;
    if (typeof c === 'string') {
      return c;
    }
    throw new TypeError(`Unknown slug: "${slug}"`)
  });

/**
 * @param {Readonly<{ slug: string, title: string, published: string | null }>} navi
 * @returns {{ path: string, title: string } | null}
 */
const buildNavi = ({ slug, title, published }) =>
  published == null ? null : { path: `/blog/${slug}`, title };

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- `metadata` is a JSON type.
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
