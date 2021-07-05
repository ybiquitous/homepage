/**
 * @param {{ date: Date, className?: string }} props
 */
export const Time = ({ date, className }) => (
  <time dateTime={date.toISOString()} className={className}>
    {new Date(date).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}
  </time>
);
