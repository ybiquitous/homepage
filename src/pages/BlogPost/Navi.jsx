import { Link } from "../../components/Link";

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
  <Link href={href} className="flex min-w-0 gap-x-1" title={`${label} post: ${title}`}>
    <span className="my-text-secondary shrink-0">{`${labelShort}:`}</span>
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
