import React, { useState } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faImages, faAngleRight } from "@fortawesome/free-solid-svg-icons";

function Header() {
  return (
    <header>
      <h1>
        <a href="/">ybiquitous</a> home
      </h1>
      <figure className="avatar">
        <img
          src="https://www.gravatar.com/avatar/515b5bb81e946fd400e18de5c4d0763f?s=60"
          alt="Masafumi Koba"
        />
        <figcaption>
          <span>
            Masafumi Koba (<em>@ybiquitous</em>)
          </span>
          <small>Web Developer</small>
        </figcaption>
      </figure>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <p>
        <small>© Masafumi Koba</small>
      </p>
    </footer>
  );
}

const slides = [
  ["website-performance", "サイトスピードを改善する", "2017-05-25"],
  ["test-and-refactoring", "テストとリファクタリング", "2017-04-06"],
  ["progressive-web-apps-hackathon", "Progressive Web Apps Hackathon", "2017-03-16"],
  ["css-in-js", "CSS in JS", "2016-12-08"],
];

function Slides() {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <button
        id="menu-slides-button"
        className="menu-link text-button menu-slides-button"
        onClick={() => setExpanded(!expanded)}
        aria-haspopup={true}
        aria-controls="menu-slides"
        aria-expanded={expanded}
      >
        <FontAwesomeIcon icon={faImages} className="menu-icon" />
        Slides
      </button>
      <ul
        id="menu-slides"
        className="menu-slides"
        role="menu"
        aria-labelledby="menu-slides-button"
        aria-hidden={!expanded}
      >
        {slides.map(([id, title, date]) => (
          <li key={id} role="none">
            <a href={`/slides/${id}`} className="menu-link" role="menuitem">
              <FontAwesomeIcon icon={faAngleRight} fixedWidth />
              {title} (
              <time dateTime={date}>
                {new Date(date).toLocaleDateString(document.documentElement.lang, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              )
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

function Main() {
  return (
    <main>
      <nav>
        <ul className="menu">
          <li>
            <a
              href="https://github.com/ybiquitous"
              target="_blank"
              rel="noopener"
              className="menu-link"
            >
              <FontAwesomeIcon icon={faGithub} className="menu-icon" />
              GitHub
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com/ybiquitous"
              target="_blank"
              rel="noopener"
              className="menu-link"
            >
              <FontAwesomeIcon icon={faTwitter} className="menu-icon" />
              Twitter
            </a>
          </li>
          <li>
            <Slides />
          </li>
        </ul>
      </nav>
    </main>
  );
}

function Index() {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
}

ReactDOM.render(<Index />, document.getElementById("root"));
