import { useCallback } from "react";

/**
 * @type {React.FC<{
 *   href: string,
 *   children: React.ReactNode,
 *   className?: string,
 *   external?: boolean,
 * }>}
 */
export const Link = ({ href, children, className, external = href.startsWith("http") }) => {
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
