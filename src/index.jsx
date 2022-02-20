import "./index.css";
import { render } from "react-dom";
import { Link } from "./Link";
import { Router } from "./Router";

const LicenseLink = () => (
  <Link href="https://creativecommons.org/licenses/by-sa/4.0/">
    CC BY-SA 4.0
  </Link>
);

const Root = () => (
  <>
    <Router />

    <footer className="my-text-secondary text-center mt-16">
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
