import React from "react";

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Link = ({ href, children, className, style }: Props) => {
  return (
    <a
      href={href}
      className={className}
      style={style}
      onClick={event => {
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
