import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "../../Link";

/**
 * @param {{
 *   link: string,
 *   icon: import("@fortawesome/react-fontawesome").FontAwesomeIconProps["icon"],
 *   content: string,
 *   subContent?: string,
 * }} props
 */
export const Menu = ({ link, icon, content, subContent }) => (
  <div className="rounded border text-xl shadow transition-shadow hover:shadow-lg dark:hover:border-sky-500 dark:hover:text-sky-500">
    <Link
      className="flex items-center gap-4 px-5 pb-5 pt-6 !text-current"
      href={link}
      showExternalIcon
    >
      <FontAwesomeIcon icon={icon} fixedWidth />
      <span>{content}</span>
      {subContent != null && <small className="my-text-secondary">{subContent}</small>}
    </Link>
  </div>
);
