import type { ReactNode, CSSProperties } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export const Link = ({ href, children, className, style }: Props) => (
  <a
    href={href}
    className={className}
    style={style}
    onClick={(event) => {
      if (event.metaKey) {
        return; // normal behavior
      }

      event.preventDefault();

      const state = null;
      window.history.pushState(state, "", href);
      window.dispatchEvent(new PopStateEvent("popstate", { state }));
    }}
  >
    {children}
  </a>
);
