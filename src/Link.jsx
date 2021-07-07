import { useCallback } from "react";

/**
 * @param {{
 *   href: string,
 *   children: React.ReactNode,
 *   className?: string,
 *   external?: boolean,
 * }} props
 */
export const Link = ({ href, children, className, external = href.startsWith("http") }) => {
  /** @type {React.MouseEventHandler | undefined} */
  const handleClick = external
    ? undefined
    : useCallback(
        (event) => {
          if (event.metaKey) {
            return; // normal behavior
          }

          event.preventDefault();

          /** @type {null} */
          const state = null;
          window.history.pushState(state, "", href);
          window.dispatchEvent(new PopStateEvent("popstate", { state }));
        },
        [href]
      );

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener" : undefined}
    >
      {children}
    </a>
  );
};
