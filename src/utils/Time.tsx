import React from "react";

const dateFormats = Object.freeze({
  year: "numeric",
  month: "short",
  day: "numeric",
});

interface Props {
  date: Date;
  style?: React.CSSProperties;
}

export const Time = ({ date, style }: Props) => {
  return (
    <time
      dateTime={date.toISOString()}
      style={{
        color: "var(--secondary-text-color)",
        fontSize: "0.9em",
        fontStyle: "italic",
        ...style,
      }}
    >
      {new Date(date).toLocaleDateString("en", dateFormats)}
    </time>
  );
};
