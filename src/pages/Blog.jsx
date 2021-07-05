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

      <main>
        <h1 className="text-4xl mt-8 mb-16">Recent posts</h1>

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
                <Link href={path} className="block text-blue-800 hover:underline">
                  <div className="text-lg">{title}</div>
                  {published != null && (
                    <Time date={new Date(published)} className="text-gray-400" />
                  )}
                </Link>
              </li>
            ))}
        </ul>
      </main>
    </>
  );
};
