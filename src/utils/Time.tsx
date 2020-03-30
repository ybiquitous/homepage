import React from "react";
import styles from "./Time.css";

const dateFormats = Object.freeze({
  year: "numeric",
  month: "long",
  day: "numeric",
});

type Props = {
  date: Date;
  style?: React.CSSProperties;
};

export const Time = ({ date, style }: Props) => {
  return (
    <time dateTime={date.toISOString()} className={styles.time} style={style}>
      {new Date(date).toLocaleDateString("en", dateFormats)}
    </time>
  );
};
