import s from "./Time.module.css";

/**
 * @param {{ date: Date, style?: React.CSSProperties }} props
 */
export const Time = ({ date, style }) => (
  <time dateTime={date.toISOString()} className={s.time} style={style}>
    {new Date(date).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}
  </time>
);
