import { Time } from "../../utils";

/**
 * @param {{ published: string | null, lastUpdated: string | null }} props
 */
export const Times = ({ published, lastUpdated }) => (
  <div className="my-text-secondary flex flex-wrap gap-x-4 text-sm">
    {published == null ? <em>Draft</em> : <Time date={new Date(published)} />}
    {lastUpdated != null && lastUpdated !== published && (
      <span>
        (
        <Time date={new Date(lastUpdated)} />
        {" updated)"}
      </span>
    )}
  </div>
);
