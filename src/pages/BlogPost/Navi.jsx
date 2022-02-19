import { Link } from "../../Link";

/**
 * @see https://leonardofaria.net/2020/07/18/using-flexbox-and-text-ellipsis-together
 *
 * @param {{
 *   href: string,
 *   title: string,
 *   label: string,
 *   labelShort: string,
 * }} props
 */
const NaviLink = ({ href, title, label, labelShort }) => (
  <Link
    href={href}
    className="flex gap-x-1 min-w-0 hover:my-link-color"
    title={`${label} post: ${title}`}
  >
    <span className="my-text-gray shrink-0">{`${labelShort}:`}</span>
    <span className="truncate">{title}</span>
  </Link>
);

/**
 * @param {{
 *   prev: { path: string, title: string } | null,
 *   next: { path: string, title: string } | null,
 * }} props
 */
export const Navi = ({ prev, next }) => (
  <nav className="flex justify-between gap-4">
    {prev != null && (
      <NaviLink href={prev.path} title={prev.title} label="Previous" labelShort="Prev" />
    )}
    {next != null && (
      <NaviLink href={next.path} title={next.title} label="Next" labelShort="Next" />
    )}
  </nav>
);
