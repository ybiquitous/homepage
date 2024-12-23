import { isValidElement, cloneElement } from "react";
import { Link } from "./Link";

const home = { el: <Link href="/">Home</Link>, key: "Home" };

/**
 * @typedef {{ el: React.ReactElement, key: string }} Item
 * @typedef {ReadonlyArray<string | Item>} Items
 */

/**
 * @param {{ items: Items }} props
 */
export const Breadcrumb = ({ items }) => (
  <nav aria-label="Breadcrumb">
    <ol className="flex flex-wrap">
      {[home, ...items].map((item, index, list) => {
        const current = index === list.length - 1;
        const classNames = ["inline-flex", "items-center"];
        if (!current) {
          classNames.push("after:content-['/']", "after:text-xs", "after:mx-2");
        }
        const className = classNames.join(" ");
        const { el, key } = typeof item === "string" ? { el: item, key: item } : item;
        return (
          <li key={key} aria-current={current ? "page" : undefined} className={className}>
            {isValidElement(el) ? cloneElement(el, { className: "my-text-secondary" }) : el}
          </li>
        );
      })}
    </ol>
  </nav>
);
