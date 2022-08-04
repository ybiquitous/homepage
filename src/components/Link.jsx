import { useCallback } from "react";

/**
 * @param {{
 *   href: string,
 *   children: React.ReactNode,
 *   className?: string,
 *   title?: string,
 *   openNewWindow?: boolean,
 *   noIcon?: boolean,
 * }} props
 */
export const Link = ({
  href,
  children,
  className,
  title,
  openNewWindow = false,
  noIcon = false,
}) => {
  /** @type {React.MouseEventHandler} */
  const handleClick = useCallback(
    (event) => {
      if (openNewWindow || href.startsWith("http")) return;

      // normal behavior
      if (event.metaKey) return;

      event.preventDefault();

      /** @type {null} */
      const state = null;
      window.history.pushState(state, "", href);
      window.dispatchEvent(new PopStateEvent("popstate", { state }));
    },
    [href]
  );

  /* eslint-disable react/jsx-no-target-blank -- False positive. */
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
  /* eslint-enable react/jsx-no-target-blank */
};
