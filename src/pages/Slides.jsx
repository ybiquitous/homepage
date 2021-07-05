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

      <main>
        <h1 className="text-3xl mt-8 mb-16">Recent slides</h1>

        <ul className="space-y-12">
          {metadata
            .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
            .map(({ id, title, date }) => (
              <li key={id}>
                <Link
                  href={`/slides/${id}`}
                  className="block text-blue-800 hover:underline"
                  external
                >
                  <div className="text-lg">{title}</div>
                  <Time date={new Date(date)} className="text-gray-400" />
                </Link>
              </li>
            ))}
        </ul>
      </main>
    </>
  );
};
