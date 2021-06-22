import { render } from "react-dom";
import { Router } from "./Router";
import "./index.css";

const Footer = () => (
  <footer>
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
