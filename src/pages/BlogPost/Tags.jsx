/**
 * @param {{ tags: string[] }} props
 */
export const Tags = ({ tags }) => {
  return (
    <div className="flex gap-2 font-sans mt-2">
      {tags.map((tag, index) => (
        <small className="text-white bg-blue-500 rounded-md py-1 px-2" key={index}>
          {`#${tag}`}
        </small>
      ))}
    </div>
  );
};
