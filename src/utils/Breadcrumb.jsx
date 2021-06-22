import { Link } from "../Link";
import s from "./Breadcrumb.module.css";

/**
 * @param {{ links: React.ReactNode[] }} props
 */
export const Breadcrumb = ({ links }) => {
  const home = <Link href="/">Home</Link>;

  return (
    <nav aria-label="Breadcrumb">
      <ol className={s.breadcrumb}>
        {[home, ...links].map((link, index) => (
          <li
            key={index}
            aria-current={index === links.length - 1 ? "page" : undefined}
            className={s.breadcrumbItem}
          >
            {link}
          </li>
        ))}
      </ol>
    </nav>
  );
};
