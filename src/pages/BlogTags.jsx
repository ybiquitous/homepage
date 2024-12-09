import { Breadcrumb } from "../components/Breadcrumb";
import { Link } from "../components/Link";
import { Title } from "../components/Title";
import { pluralize } from "../utils/pluralize";

/**
 * @param {{
 *   postsByTag: Map<string, ReadonlyArray<import("../blog/index.js").BlogPost>>,
 * }} props
 */
export const BlogTags = ({ postsByTag }) => {
  const tagCount = postsByTag.size;
  const sortedPostsByTag = [...postsByTag].sort(([a], [b]) => a.localeCompare(b));

  return (
    <>
      <Title content="Tags" />

      <header>
        <Breadcrumb items={[{ el: <Link href="/blog">Blog</Link>, key: "Blog" }, "Tags"]} />
      </header>

      <main className="mt-8">
        {tagCount === 0 ? (
          <p>
            <em>No tags found.</em>
          </p>
        ) : (
          <>
            <ul className="mt-4">
              {sortedPostsByTag.map(([tag, posts]) => (
                <li className="py-1 text-lg" key={tag}>
                  <Link href={`/blog/tags/${tag}`}>
                    <span>{`#${tag}`}</span>
                    <span className="my-text-secondary ms-4 text-sm">
                      {`(${posts.length} ${pluralize(posts.length, "post")})`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="my-text-secondary mt-8 text-sm">
              {`Total ${tagCount} ${pluralize(tagCount, "tag")}`}
            </p>
          </>
        )}
      </main>
    </>
  );
};
