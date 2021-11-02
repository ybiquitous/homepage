import "./index.css";
import { render } from "react-dom";
import { Router } from "./Router";

const Root = () => (
  <>
    <Router />

    <footer className="my-text-gray text-center mt-16">
      <p>
        <small>© 2019-{new Date().getFullYear()} Masafumi Koba</small>
      </p>
    </footer>
  </>
);

render(<Root />, document.getElementById("root"));
