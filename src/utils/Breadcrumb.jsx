import { isValidElement, cloneElement } from "react";
import { Link } from "../Link";

/**
 * @param {{ items: React.ReactNode[] }} props
 */
export const Breadcrumb = ({ items }) => {
  const home = <Link href="/">Home</Link>;

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap">
        {[home, ...items].map((item, index, items) => {
          const current = index === items.length - 1;
          const classNames = ["inline-flex items-center"];
          if (!current) {
            classNames.push("my-text-gray after:content-['/'] after:text-xs after:mx-2");
          }
          return (
            <li
              key={index}
              aria-current={current ? "page" : undefined}
              className={classNames.join(" ")}
            >
              {isValidElement(item)
                ? cloneElement(item, { className: "hover:my-link-color" })
                : item}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
