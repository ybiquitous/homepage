import { Breadcrumb } from "../components/Breadcrumb";
import { Link } from "../components/Link";
import { Tags } from "../components/Tags";
import { Time } from "../components/Time";
import { useTitle } from "../hooks/useTitle";

/**
 * @param {{
 *   blogs: ReadonlyArray<import("../blog/index").Blog>,
 *   title?: string | undefined,
 * }} props
 */
export const Blog = ({ blogs, title }) => {
  useTitle("Blog", title);

  return (
    <>
      <header>
        <Breadcrumb
          items={title ? [{ el: <Link href="/blog">Blog</Link>, key: "Blog" }, title] : ["Blog"]}
        />
      </header>

      <main className="mt-16">
        <ul className="divide-y divide-dashed divide-slate-300 dark:divide-slate-600">
          {blogs
            .filter(({ published }) => Boolean(published))
            .sort((a, b) => {
              if (!a.published || !b.published) {
                return 0;
              }
              return Date.parse(b.published) - Date.parse(a.published);
            })
            .map(({ path, title, published, tags }) => (
              <li key={path} className="py-10 first:pt-0 last:pb-0">
                <Link href={path} className="block !text-current">
                  <div className="font-sans text-xl">{title}</div>
                  {published ? (
                    <Time date={new Date(published)} className="my-text-secondary" />
                  ) : null}
                </Link>
                {tags.length !== 0 && (
                  <div className="mt-8">
                    <Tags tags={tags} />
                  </div>
                )}
              </li>
            ))}
        </ul>
      </main>
    </>
  );
};
