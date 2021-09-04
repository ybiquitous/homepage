import { Link } from "../../Link";

/**
 * @param {{
 *   prev: { path: string, title: string } | null,
 *   next: { path: string, title: string } | null,
 * }} props
 */
export const Navi = ({ prev, next }) => {
  const itemClassName = "truncate inline-block max-w-max sm:max-w-sm";

  return (
    <nav className="flex flex-col sm:flex-row justify-between gap-4">
      {prev != null ? (
        <Link href={prev.path} className="inline-flex hover:my-link-color">
          <span className="mr-1 my-text-gray">Prev:</span>
          <span title={prev.title} className={itemClassName}>
            {prev.title}
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next != null ? (
        <Link href={next.path} className="inline-flex hover:my-link-color">
          <span className="mr-1 my-text-gray">Next:</span>
          <span title={next.title} className={itemClassName}>
            {next.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
};
