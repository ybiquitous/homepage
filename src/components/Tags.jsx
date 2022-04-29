/**
 * @param {{ tags: string[] }} props
 */
export const Tags = ({ tags }) => (
  <div className="flex flex-wrap gap-2 font-sans">
    {tags.map((tag) => (
      <small className="rounded-md border border-current py-1 px-2" key={tag}>
        {`#${tag}`}
      </small>
    ))}
  </div>
);
