import { Link } from "../Link";
import { Breadcrumb, Time, useTitle } from "../utils";
import s from "./Blog.css";
import metadata from "../blog/metadata.json";

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
          {metadata
            .filter(({ published }) => published != null)
            .sort((a, b) => {
              if (a.published == null || b.published == null) {
                return 0;
              }
              return Date.parse(b.published) - Date.parse(a.published);
            })
            .map(({ id, title, published }) => (
              <li key={id} className={s.listItem}>
                <Link href={`/blog/${id}`} className={s.link}>
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
