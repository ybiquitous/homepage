import { useCallback } from "react";

/**
 * @param {{
 *   href: string,
 *   children: React.ReactNode,
 *   className?: string,
 *   title?: string,
 *   openNewWindow?: boolean,
 *   noIcon?: boolean,
 *   noPushState?: boolean,
 * }} props
 */
export const Link = ({
  href,
  children,
  className,
  title,
  openNewWindow = false,
  noIcon = false,
  noPushState = false,
}) => {
  /** @type {React.MouseEventHandler} */
  const handleClick = useCallback(
    (event) => {
      if (openNewWindow || noPushState || href.startsWith("http")) return;

      // normal behavior
      if (event.metaKey) return;

      event.preventDefault();

      /** @type {null} */
      const state = null;
      window.history.pushState(state, "", href);
      window.dispatchEvent(new PopStateEvent("popstate", { state }));
    },
    [href, openNewWindow, noPushState],
  );

  return (
    <a
      href={href}
      className={`${className ?? ""} ${noIcon ? "no-icon" : ""}`.trim()}
      title={title}
      target={openNewWindow ? "_blank" : undefined}
      rel={openNewWindow ? "noopener" : undefined}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};
