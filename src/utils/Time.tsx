import React from "react";
import styles from "./Time.css";

type Props = {
  date: Date;
  style?: React.CSSProperties;
};

export const Time = ({ date, style }: Props) => (
  <time dateTime={date.toISOString()} className={styles.time} style={style}>
    {new Date(date).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}
  </time>
);
