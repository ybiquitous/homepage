/**
 * @param {{ tags: string[] }} props
 */
export const Tags = ({ tags }) => (
  <div className="flex gap-2 font-sans">
    {tags.map((tag) => (
      <small className="border border-gray-300 hover:border-current rounded-md py-1 px-2" key={tag}>
        {`#${tag}`}
      </small>
    ))}
  </div>
);
