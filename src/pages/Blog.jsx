import { Link } from "../Link";
import { Breadcrumb, Time, useTitle } from "../utils";
import s from "./Blog.module.css";
import { blogs } from "../blog/index";

export const Blog = () => {
  useTitle("Blog");

  return (
    <>
      <header>
        <Breadcrumb links={["Blog"]} />
      </header>

      <main>
        <h1 className={s.title}>Recent posts</h1>

        <ul className={s.list}>
          {blogs
            .filter(({ published }) => published != null)
            .sort((a, b) => {
              if (a.published == null || b.published == null) {
                return 0;
              }
              return Date.parse(b.published) - Date.parse(a.published);
            })
            .map(({ path, title, published }) => (
              <li key={path} className={s.listItem}>
                <Link href={path} className={s.link}>
                  {title}
                </Link>
                {published != null && <Time date={new Date(published)} />}
              </li>
            ))}
        </ul>
      </main>
    </>
  );
};
