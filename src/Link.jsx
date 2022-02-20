import { useCallback } from "react";

/**
 * @param {{
 *   href: string,
 *   children: React.ReactNode,
 *   external?: boolean,
 * } & React.AnchorHTMLAttributes<HTMLAnchorElement>} props
 */
export const Link = ({ href, children, className, title, external = href.startsWith("http") }) => {
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

  /* eslint-disable react/jsx-no-target-blank -- False positive. */
  return (
    <a
      href={href}
      className={className}
      title={title}
      onClick={handleClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
    >
      {children}
    </a>
  );
  /* eslint-enable react/jsx-no-target-blank */
};
