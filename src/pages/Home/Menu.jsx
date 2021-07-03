import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "../../Link";

/** @typedef {import("@fortawesome/react-fontawesome").FontAwesomeIconProps} IconProps */

/**
 * @param {{ link: string, icon: IconProps["icon"], content: string, subContent?: string }} props
 */
export const Menu = ({ link, icon, content, subContent }) => {
  return (
    <div className="text-xl border rounded shadow hover:shadow-lg hover:bg-blue-50 transition-shadow transition-colors">
      <Link className="flex items-center px-5 pb-5 pt-6 gap-4" href={link}>
        <FontAwesomeIcon icon={icon} fixedWidth className="text-gray-600" />
        <span>{content}</span>
        {subContent != null && <small className="text-gray-400">{subContent}</small>}
      </Link>
    </div>
  );
};
