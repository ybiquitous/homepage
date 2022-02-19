import { Time } from "../../utils";

/**
 * @param {{ published: string | null, lastUpdated: string | null }} props
 */
export const Times = ({ published, lastUpdated }) => (
  <div className="text-sm my-text-gray flex flex-wrap gap-x-4">
    {published != null ? <Time date={new Date(published)} /> : <em>Draft</em>}
    {lastUpdated != null && (
      <span>
        {"("}
        <Time date={new Date(lastUpdated)} />
        {" updated)"}
      </span>
    )}
  </div>
);
