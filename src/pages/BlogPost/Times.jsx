import { Time } from "../../components/Time";

/**
 * @param {{ published: Date | null, lastUpdated: Date | null }} props
 */
export const Times = ({ published, lastUpdated }) => (
  <div className="my-text-secondary flex flex-wrap gap-x-4 text-sm">
    {published == null ? <em>Draft</em> : <Time date={published} />}
    {lastUpdated != null && lastUpdated !== published && (
      <span>
        (
        <Time date={lastUpdated} />
        {" updated)"}
      </span>
    )}
  </div>
);
