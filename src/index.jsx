import "./index.css";
import { render } from "react-dom";
import { Router } from "./Router";

const Footer = () => (
  <footer className="text-gray-400 mt-12">
    <p>
      <small>© Masafumi Koba</small>
    </p>
  </footer>
);

const Index = () => {
  return (
    <>
      <Router />
      <Footer />
    </>
  );
};

render(<Index />, document.getElementById("root"));
