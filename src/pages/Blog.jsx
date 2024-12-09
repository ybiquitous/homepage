import { allPostYears } from "../blog/index.js";
import { Breadcrumb } from "../components/Breadcrumb";
import { Link } from "../components/Link";
import { Tags } from "../components/Tags";
import { Time } from "../components/Time";
import { buildTitle } from "../utils/buildTitle";
import { pluralize } from "../utils/pluralize";

const YEARS = [...allPostYears].reverse();

/**
 * @param {{
 *   posts: ReadonlyArray<import("../blog/index.js").BlogPost>,
 *   breadcrumbs: import("../components/Breadcrumb.js").Items,
 * }} props
 */
// eslint-disable-next-line max-lines-per-function
export const Blog = ({ posts, breadcrumbs }) => {
  const mainTitle = "Blog";
  const subTitles = breadcrumbs.map((b) => (typeof b === "string" ? b : b.key));

  const breadcrumbItems =
    breadcrumbs.length === 0
      ? [mainTitle]
      : [{ el: <Link href="/blog">{mainTitle}</Link>, key: mainTitle }, ...breadcrumbs];

  return (
    <>
      <title>{buildTitle(mainTitle, ...subTitles)}</title>

      <header>
        <Breadcrumb items={breadcrumbItems} />
      </header>

      <main className="mt-8">
        <ul className="mb-8 inline-flex list-none flex-wrap divide-x divide-slate-300 dark:divide-slate-600">
          {YEARS.map((year) => (
            <li className="px-2 first:ps-0 last:pe-0" key={year}>
              <a className="my-text-secondary text-sm" href={`/blog/${year}`}>
                {year}
              </a>
            </li>
          ))}
        </ul>

        <ul className="divide-y divide-dashed divide-slate-300 dark:divide-slate-600">
          {posts
            .filter(({ published }) => published != null)
            .sort((a, b) => (b.published?.getTime() ?? 0) - (a.published?.getTime() ?? 0))
            .map(({ path, title: blogTitle, published, author, tags }) => (
              <li key={path} className="py-10 first:pt-0 last:pb-0">
                <Link href={path} className="grid gap-2 !text-current">
                  <div className="text-xl">{blogTitle}</div>
                  <div className="my-text-secondary flex flex-wrap gap-x-8 text-sm">
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

        <div className="my-text-secondary mt-12 text-sm">
          {`Total ${posts.length} ${pluralize(posts.length, "post")}`}
        </div>
      </main>
    </>
  );
};
