import { useTitle } from "../utils";

export const NotFound = () => {
  useTitle("Page Not Found");

  return (
    <main className="text-center py-12">
      <h1 className="text-8xl">Ooops!</h1>
      <p className="text-lg mt-24">Sorry, the Page is Not Found.</p>
      <p className="text-lg mt-4">
        <a href="/">Back to Home</a>
      </p>
    </main>
  );
};
