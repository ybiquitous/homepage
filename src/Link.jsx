import { useCallback, useState } from "react";

/**
 * @typedef {Object} Props
 * @property {string} href
 * @property {React.ReactNode} children
 * @property {string} [className]
 * @property {React.CSSProperties} [style]
 */

/**
 * @param {Props} props
 */
export const Link = ({ href, children, className, style }) => {
  /** @type {React.MouseEventHandler} */
  const handleClick = useCallback(
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
    <a href={href} className={className} style={style} onClick={handleClick}>
      {children}
    </a>
  );
};
