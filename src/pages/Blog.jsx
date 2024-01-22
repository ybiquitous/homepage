import { Breadcrumb } from "../components/Breadcrumb";
import { Link } from "../components/Link";
import { Tags } from "../components/Tags";
import { Time } from "../components/Time";
import { useTitle } from "../hooks/useTitle";

/**
 * @param {{
 *   posts: ReadonlyArray<import("../blog/index.js").BlogPost>,
 *   title?: string | undefined,
 * }} props
 */
export const Blog = ({ posts, title }) => {
  useTitle("Blog", title);

  return (
    <>
      <header>
        <Breadcrumb
          items={
            title === undefined
              ? ["Blog"]
              : [{ el: <Link href="/blog">Blog</Link>, key: "Blog" }, title]
          }
        />
      </header>

      <main className="mt-16">
        <ul className="divide-y divide-dashed divide-slate-300 dark:divide-slate-600">
          {posts
            .filter(({ published }) => published != null)
            .sort((a, b) => (b.published?.getTime() ?? 0) - (a.published?.getTime() ?? 0))
            .map(({ path, title: blogTitle, published, author, tags }) => (
              <li key={path} className="py-10 first:pt-0 last:pb-0">
                <Link href={path} className="block !text-current">
                  <div className="text-xl">{blogTitle}</div>
                  <div className="my-text-secondary flex flex-wrap gap-x-8">
                    {published !== null && <Time date={published} />}
                    <address>{`by ${author}`}</address>
                  </div>
                </Link>
                {tags.length !== 0 && (
                  <div className="mt-4">
                    <Tags tags={tags} />
                  </div>
                )}
              </li>
            ))}
        </ul>

        <div className="my-text-secondary mt-12 text-center text-sm">{`Total ${posts.length} ${
          posts.length === 1 ? "post" : "posts"
        }`}</div>
      </main>
    </>
  );
};
