import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Link } from "./components/Link";
import { Router } from "./components/Router";
import { ThemeToggle } from "./components/ThemeToggle";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js").catch((error) => {
    console.error(error);
  });
}

const LicenseLink = () => (
  <Link href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</Link>
);

const Root = () => (
  <StrictMode>
    <div className="mb-2 text-right">
      <ThemeToggle />
    </div>

    <Router />

    <footer className="my-text-secondary mt-16 text-center">
      <p>
        <small>
          © 2019-{new Date().getFullYear()} Masafumi Koba. The content on this website is licensed
          under a <LicenseLink /> license.
        </small>
      </p>
    </footer>
  </StrictMode>
);

const container = document.getElementById("root");
if (container === null) {
  throw new Error("No container!");
}
const root = createRoot(container);
root.render(<Root />);
