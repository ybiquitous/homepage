/**
 * @param {{ tags: string[] }} props
 */
export const Tags = ({ tags }) => {
  return (
    <div className="flex gap-2 font-sans">
      {tags.map((tag) => (
        <small
          className="bg-gray-100 text-gray-500 hover:text-white hover:bg-green-500 rounded-md py-1 px-2"
          key={tag}
        >
          {`#${tag}`}
        </small>
      ))}
    </div>
  );
};
