import { Link } from "./Link";

/**
 * @param {{ tags: ReadonlyArray<string> }} props
 */
export const Tags = ({ tags }) => (
  <div className="flex flex-wrap gap-2">
    {tags.map((tag) => (
      <Link href={`/blog/tags/${tag}`} key={tag}>
        <small className="rounded-md border border-current px-2 py-1" key={tag}>
          {`#${tag}`}
        </small>
      </Link>
    ))}
  </div>
);
