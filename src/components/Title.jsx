const base = "@ybiquitous";
const separator = " - ";

/**
 * @param {{
 *   parts?: string | ReadonlyArray<string | null | undefined>,
 * }} props
 */
export const Title = ({ parts = [] }) => {
  parts = [parts].flat();
  const content = parts.length === 0 ? base : [...parts, base].filter(Boolean).join(separator);

  return <title>{content}</title>;
};
