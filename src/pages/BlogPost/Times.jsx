import { Time } from "../../utils";

/**
 * @param {{ published: string | null, lastUpdated: string | null }} props
 */
export const Times = ({ published, lastUpdated }) => (
  <div className="text-sm my-text-gray flex flex-wrap gap-x-4">
    {published == null ? <em>Draft</em> : <Time date={new Date(published)} />}
    {lastUpdated != null && (
      <span>
        (
        <Time date={new Date(lastUpdated)} />
        {" updated)"}
      </span>
    )}
  </div>
);
