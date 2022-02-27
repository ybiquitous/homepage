/**
 * @param {{ tags: string[] }} props
 */
export const Tags = ({ tags }) => (
  <div className="flex flex-wrap gap-2 font-sans">
    {tags.map((tag) => (
      <small className="rounded-md border border-gray-300 py-1 px-2 hover:border-current" key={tag}>
        {`#${tag}`}
      </small>
    ))}
  </div>
);
