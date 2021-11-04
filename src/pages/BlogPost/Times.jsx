import { Time } from "../../utils";

/**
 * @param {{ published: string | null, lastUpdated: string | null }} props
 */
export const Times = ({ published, lastUpdated }) => (
  <div className="text-sm my-text-gray flex flex-col sm:flex-row sm:gap-12">
    {published != null ? (
      <span>
        <Time date={new Date(published)} />
        <span className="ml-1">published</span>
      </span>
    ) : (
      <em>Unpublished</em>
    )}
    {lastUpdated != null && (
      <span>
        <Time date={new Date(lastUpdated)} />
        <span className="ml-1">updated</span>
      </span>
    )}
  </div>
);
