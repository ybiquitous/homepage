import { Breadcrumb } from "../components/Breadcrumb";
import { Link } from "../components/Link";
import { Time } from "../components/Time";
import { useTitle } from "../hooks/useTitle";
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
                <Link href={`/slides/${id}`} className="block !text-current">
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
