import { Title } from "../components/Title";

export const NotFound = () => {
  return (
    <>
      <Title parts={"Page Not Found"} />

      <main className="py-12 text-center">
        <h1 className="text-8xl">Ooops!</h1>
        <p className="mt-24 text-lg">Sorry, the Page is Not Found.</p>
        <p className="mt-4 text-lg">
          <a href="/">Back to Home</a>
        </p>
      </main>
    </>
  );
};
