import React from "react";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export const Link = ({ href, children, className, style }: Props) => {
  return (
    <a
      href={href}
      className={className}
      style={style}
      onClick={event => {
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
};
