import "./index.css";
import { render } from "react-dom";
import { Router } from "./Router";

const Root = () => {
  return (
    <>
      <Router />

      <footer className="text-gray-400 text-center mt-16">
        <p>
          <small>© Masafumi Koba</small>
        </p>
      </footer>
    </>
  );
};

render(<Root />, document.getElementById("root"));
