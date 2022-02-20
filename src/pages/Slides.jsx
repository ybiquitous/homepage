import { Link } from "../Link";
import { Breadcrumb, Time, useTitle } from "../utils";
import metadata from "./slides-metadata.json";

export const Slides = () => {
  useTitle("Slides");

  return (
    <>
      <header>
        <Breadcrumb items={["Slides"]} />
      </header>

      <main className="mt-16">
        <ul className="divide-y divide-dashed">
          {metadata
            .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
            .map(({ id, title, date }) => (
              <li key={id} className="py-10 first:pt-0 last:pb-0">
                <Link href={`/slides/${id}`} className="block text-current" external>
                  <div className="font-sans text-xl">{title}</div>
                  <Time date={new Date(date)} className="my-text-secondary" />
                </Link>
              </li>
          ))}
        </ul>
      </main>
    </>
  );
};
