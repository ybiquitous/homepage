import React from "react";
import ReactDOM from "react-dom";
import { Home } from "./Home";

const Footer = () => {
  return (
    <footer>
      <p>
        <small>© Masafumi Koba</small>
      </p>
    </footer>
  );
};

const Index = () => {
  return (
    <>
      <Home />
      <Footer />
    </>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));
