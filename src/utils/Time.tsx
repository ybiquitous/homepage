import React from "react";
import "./Time.css";

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
    <time dateTime={date.toISOString()} className="Time" style={style}>
      {new Date(date).toLocaleDateString("en", dateFormats)}
    </time>
  );
};
