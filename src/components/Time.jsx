const FORMATTER_TITLE = new Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "long" });
const FORMATTER_CONTENT = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

/**
 * @param {{ date: Date, className?: string }} props
 */
export const Time = ({ date, className }) => (
  <time dateTime={date.toISOString()} className={className} title={FORMATTER_TITLE.format(date)}>
    {FORMATTER_CONTENT.format(date)}
  </time>
);
