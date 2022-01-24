import "./index.css";
import { render } from "react-dom";
import { Router } from "./Router";

const LicenseLink = () => (
  <a className="my-link-color" href="https://creativecommons.org/licenses/by-sa/4.0/">
    CC BY-SA 4.0
  </a>
);

const Root = () => (
  <>
    <Router />

    <footer className="my-text-gray text-center mt-16">
      <p>
        <small>
          © 2019-{new Date().getFullYear()} Masafumi Koba. The content on this website is licensed
          under a <LicenseLink /> license.
        </small>
      </p>
    </footer>
  </>
);

render(<Root />, document.getElementById("root"));
