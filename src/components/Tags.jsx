import { Link } from "./Link";

/**
 * @param {{ tags: ReadonlyArray<string> }} props
 */
export const Tags = ({ tags }) => (
  <div className="flex flex-wrap gap-2 font-sans">
    {tags.map((tag) => (
      <Link href={`/blog/tags/${tag}`}>
        <small className="rounded-md border border-current py-1 px-2" key={tag}>
          {`#${tag}`}
        </small>
      </Link>
    ))}
  </div>
);
