/**
 * @param {{ tags: string[] }} props
 */
export const Tags = ({ tags }) => {
  return (
    <div className="flex gap-2 font-sans mt-4">
      {tags.map((tag, index) => (
        <small className="text-white bg-blue-600 rounded-md py-1 px-2" key={index}>
          {`#${tag}`}
        </small>
      ))}
    </div>
  );
};
