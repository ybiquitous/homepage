import { Breadcrumb, Time, useTitle } from "../utils";
import s from "./Blog.module.css"; // borrow
import metadata from "./slides-metadata.json";

export const Slides = () => {
  useTitle("Slides");

  return (
    <>
      <header>
        <Breadcrumb items={["Slides"]} />
      </header>

      <main>
        <h1 className={s.title}>Recent slides</h1>

        <ul className={s.list}>
          {metadata
            .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
            .map(({ id, title, date }) => (
              <li key={id} className={s.listItem}>
                <a href={`/slides/${id}`} target="_blank" rel="noopener" className={s.link}>
                  {title}
                </a>
                <Time date={new Date(date)} />
              </li>
            ))}
        </ul>
      </main>
    </>
  );
};
