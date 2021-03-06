import "./index.css";
import { render } from "react-dom";
import { Router } from "./Router";

const Root = () => {
  return (
    <>
      <Router />

      <footer className=".my-text-gray text-center mt-16">
        <p>
          <small>© Masafumi Koba</small>
        </p>
      </footer>
    </>
  );
};

render(<Root />, document.getElementById("root"));
