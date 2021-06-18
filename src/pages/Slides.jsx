import { Breadcrumb, Time, useTitle } from "../utils";
import s from "./Blog.css"; // borrow
import metadata from "~slides/metadata.yml";

export const Slides = () => {
  useTitle("Slides");

  return (
    <>
      <header>
        <Breadcrumb links={["Slides"]} />
      </header>

      <main>
        <h1 className={s.title}>Recent slides</h1>

        <ul className={s.list}>
          {metadata
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .map(({ id, title, date }) => (
              <li key={id} className={s.listItem}>
                <a href={`/slides/${id}`} target="_blank" rel="noopener" className={s.link}>
                  {title}
                </a>
                <Time date={date} />
              </li>
            ))}
        </ul>
      </main>
    </>
  );
};
