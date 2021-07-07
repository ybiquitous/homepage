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
export const Menu = ({ link, icon, content, subContent }) => {
  return (
    <div className="text-xl border rounded shadow hover:shadow-lg hover:my-link-color transition-shadow">
      <Link className="flex items-center px-5 pb-5 pt-6 gap-4" href={link}>
        <FontAwesomeIcon icon={icon} fixedWidth />
        <span>{content}</span>
        {subContent != null && <small className="my-text-gray">{subContent}</small>}
      </Link>
    </div>
  );
};
