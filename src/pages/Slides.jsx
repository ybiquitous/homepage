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
        <ul className="space-y-16">
          {metadata
            .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
            .map(({ id, title, date }) => (
              <li key={id}>
                <Link href={`/slides/${id}`} className="block hover:my-link-color" external>
                  <div className="font-semibold text-xl">{title}</div>
                  <Time date={new Date(date)} className="my-text-gray" />
                </Link>
              </li>
            ))}
        </ul>
      </main>
    </>
  );
};
