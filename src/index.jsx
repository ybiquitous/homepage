import "./index.css";
import React from "react";
import { render } from "react-dom";
import { Link } from "./Link";
import { Router } from "./Router";
import { ThemeToggle } from "./ThemeToggle";

const LicenseLink = () => (
  <Link href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</Link>
);

const Root = () => (
  <React.StrictMode>
    <div className="text-right mb-2">
      <ThemeToggle />
    </div>

    <Router />

    <footer className="my-text-secondary text-center mt-16">
      <p>
        <small>
          © 2019-{new Date().getFullYear()} Masafumi Koba. The content on this website is licensed
          under a <LicenseLink /> license.
        </small>
      </p>
    </footer>
  </React.StrictMode>
);

render(<Root />, document.getElementById("root"));
