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
        <ul className="space-y-16">
          {blogs
            .filter(({ published }) => Boolean(published))
            .sort((a, b) => {
              if (!a.published || !b.published) {
                return 0;
              }
              return Date.parse(b.published) - Date.parse(a.published);
            })
            .map(({ path, title, published }) => (
              <li key={path}>
                <Link href={path} className="block hover:my-link-color">
                  <div className="font-sans text-xl">{title}</div>
                  {published && <Time date={new Date(published)} className="my-text-gray" />}
                </Link>
              </li>
            ))}
        </ul>
      </main>
    </>
  );
};
