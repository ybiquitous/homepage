const base = "@ybiquitous";
const separator = " - ";

/**
 * @param {{
 *   content?: string | ReadonlyArray<string | null | undefined>,
 * }} props
 */
export const Title = ({ content }) => {
  const contentArray = [content].flat().filter(Boolean);
  const text = contentArray.length === 0 ? base : [...contentArray, base].join(separator);

  return <title>{text}</title>;
};
