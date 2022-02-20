import { Link } from "../Link";
import { blogs } from "../blog/index";
import { Breadcrumb, Time, useTitle } from "../utils";

export const Blog = () => {
  useTitle("Blog");

  return (
    <>
      <header>
        <Breadcrumb items={["Blog"]} />
      </header>

      <main className="mt-16">
        <ul className="divide-y divide-dashed">
          {blogs
            .filter(({ published }) => Boolean(published))
            .sort((a, b) => {
              if (!a.published || !b.published) {
                return 0;
              }
              return Date.parse(b.published) - Date.parse(a.published);
            })
            .map(({ path, title, published }) => (
              <li key={path} className="py-10 first:pt-0 last:pb-0">
                <Link href={path} className="block text-current">
                  <div className="font-sans text-xl">{title}</div>
                  {published && <Time date={new Date(published)} className="my-text-secondary" />}
                </Link>
              </li>
            ))}
        </ul>
      </main>
    </>
  );
};
