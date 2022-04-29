import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useState } from "react";

/**
 * @param {{
 *   href: string,
 *   children: React.ReactNode,
 *   external?: boolean,
 *   showExternalIcon?: boolean,
 * } & React.AnchorHTMLAttributes<HTMLAnchorElement>} props
 */
export const Link = ({
  href,
  children,
  className,
  title,
  external = href.startsWith("http"),
  showExternalIcon = false,
}) => {
  /** @type {React.MouseEventHandler} */
  const handleClick = useCallback(
    (event) => {
      if (external) return;

      // normal behavior
      if (event.metaKey) return;

      event.preventDefault();

      /** @type {null} */
      const state = null;
      window.history.pushState(state, "", href);
      window.dispatchEvent(new PopStateEvent("popstate", { state }));
    },
    [href, external]
  );

  const [externalIconShown, setExternalIconShown] = useState(false);

  const handleHover = useCallback(
    (/** @type {boolean}*/ toggle) => {
      if (external && showExternalIcon) {
        setExternalIconShown(toggle);
      }
    },
    [external, showExternalIcon]
  );

  /* eslint-disable react/jsx-no-target-blank -- False positive. */
  return (
    <a
      href={href}
      className={className}
      title={title}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      onClick={handleClick}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      {children}
      {externalIconShown && (
        <FontAwesomeIcon
          icon={solid("arrow-up-right-from-square")}
          size="xs"
          className="my-text-secondary"
        />
      )}
    </a>
  );
  /* eslint-enable react/jsx-no-target-blank */
};
