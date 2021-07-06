import { Link } from "../../Link";

/** @typedef {{ path: string, title: string }} Path */

/**
 * @param {{ prev: Path | null, next: Path | null }} props
 */
export const Navi = ({ prev, next }) => {
  const itemClassName = "truncate inline-block max-w-max sm:max-w-sm";

  return (
    <nav className="flex flex-col sm:flex-row justify-between gap-4 mt-20">
      {prev != null ? (
        <Link href={prev.path} className="inline-flex hover:my-link-color">
          <span className="mr-1">←</span>
          <span title={`Previous: ${prev.title}`} className={itemClassName}>
            {prev.title}
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next != null ? (
        <Link href={next.path} className="inline-flex hover:my-link-color">
          <span title={`Next: ${next.title}`} className={itemClassName}>
            {next.title}
          </span>
          <span className="ml-1">→</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
};
