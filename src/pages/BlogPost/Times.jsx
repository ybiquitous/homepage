import { Time } from "../../utils";

/**
 * @param {{ published: string | null, lastUpdated: string | null }} props
 */
export const Times = ({ published, lastUpdated }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-8">
      {published != null ? (
        <span>
          <span className="my-text-gray">Published on </span>
          <Time date={new Date(published)} />
        </span>
      ) : (
        <em>Unpublished</em>
      )}
      {lastUpdated != null && (
        <span>
          <span className="my-text-gray">Updated on </span>
          <Time date={new Date(lastUpdated)} />
        </span>
      )}
    </div>
  );
};
