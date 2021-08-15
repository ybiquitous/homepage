import { Time } from "../../utils";

/**
 * @type {React.FC<{ published: string | null, lastUpdated: string | null }>}
 */
export const Times = ({ published, lastUpdated }) => (
  <div className="text-sm my-text-gray flex flex-col sm:flex-row sm:gap-12">
    {published != null ? (
      <span>
        <em>
          <Time date={new Date(published)} />
        </em>
        <span className="ml-2">published</span>
      </span>
    ) : (
      <em>Unpublished</em>
    )}
    {lastUpdated != null && (
      <span>
        <em>
          <Time date={new Date(lastUpdated)} />
        </em>
        <span className="ml-2">updated</span>
      </span>
    )}
  </div>
);
