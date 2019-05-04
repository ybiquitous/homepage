import React, { useState } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core"; // eslint-disable-line import/named
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faAngleRight, faImages } from "@fortawesome/free-solid-svg-icons";

const IconLink = ({ href, icon }: { href: string; icon: IconProp }) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link">
      <FontAwesomeIcon icon={icon} />
    </a>
  );
};

const Profile = () => {
  return (
    <div className="profile">
      <img
        src="https://www.gravatar.com/avatar/515b5bb81e946fd400e18de5c4d0763f?s=240"
        alt="Avatar"
      />
      <div className="profile-caption">
        <span>
          Masafumi Koba (<em>@ybiquitous</em>)
        </span>
        <small>Web Developer</small>

        <span className="profile-icons">
          <IconLink href="https://github.com/ybiquitous" icon={faGithub} />
          <IconLink href="https://twitter.com/ybiquitous" icon={faTwitter} />
        </span>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <header>
      <h1>
        <a href="/">
          <span role="img" aria-label="home" style={{ marginRight: "0.25em" }}>
            🏡
          </span>
          ybiquitous
        </a>
      </h1>
      <Profile />
    </header>
  );
};

const Footer = () => {
  return (
    <footer>
      <p>
        <small>© Masafumi Koba</small>
      </p>
    </footer>
  );
};

const slides = [
  ["website-performance", "サイトスピードを改善する", "2017-05-25"],
  ["test-and-refactoring", "テストとリファクタリング", "2017-04-06"],
  ["progressive-web-apps-hackathon", "Progressive Web Apps Hackathon", "2017-03-16"],
  ["css-in-js", "CSS in JS", "2016-12-08"],
];

const Slides = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <button
        id="menu-slides-button"
        className="link text-button menu-slides-button"
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
            <a href={`/slides/${id}`} className="link menu-link" role="menuitem">
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
};

const Main = () => {
  return (
    <main>
      <nav>
        <ul className="menu">
          <li>
            <Slides />
          </li>
        </ul>
      </nav>
    </main>
  );
};

const Index = () => {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));
