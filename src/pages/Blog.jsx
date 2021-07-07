import { Link } from "../Link";
import { Breadcrumb, Time, useTitle } from "../utils";
import { blogs } from "../blog/index";

export const Blog = () => {
  useTitle("Blog");

  return (
    <>
      <header>
        <Breadcrumb items={["Blog"]} />
      </header>

      <main className="mt-16">
        <ul className="space-y-16">
          {blogs
            .filter(({ published }) => published != null)
            .sort((a, b) => {
              if (a.published == null || b.published == null) {
                return 0;
              }
              return Date.parse(b.published) - Date.parse(a.published);
            })
            .map(({ path, title, published }) => (
              <li key={path}>
                <Link href={path} className="block hover:my-link-color">
                  <div className="font-semibold text-xl">{title}</div>
                  {published != null && (
                    <Time date={new Date(published)} className="my-text-gray" />
                  )}
                </Link>
              </li>
            ))}
        </ul>
      </main>
    </>
  );
};
