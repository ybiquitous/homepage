import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core"; // eslint-disable-line import/named
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faAngleRight, faImages, faBlog } from "@fortawesome/free-solid-svg-icons";
import { Link } from "./router";
import { Time, useTitle } from "./utils";
import slidesMetadata from "~slides/metadata.yml";
import styles from "./Home.css";

const IconLink = ({ href, icon }: { href: string; icon: IconProp }) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
      <FontAwesomeIcon icon={icon} />
    </a>
  );
};

const Profile = () => {
  return (
    <div className={styles.profile}>
      <div>
        <img
          className={styles.profileImage}
          src="https://www.gravatar.com/avatar/515b5bb81e946fd400e18de5c4d0763f?s=240"
          alt="Avatar"
        />
      </div>
      <div className={styles.profileCaption}>
        <span>
          Masafumi Koba (<em>@ybiquitous</em>)
        </span>
        <small className={styles.profileDescription}>
          Web Developer. I love Emacs / JavaScript / Ruby.
        </small>

        <span className={styles.profileIcons}>
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
        <a href="/" className={styles.headerLink}>
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

const Slides = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <FontAwesomeIcon icon={faImages} fixedWidth className={styles.menuIcon} />
      <button
        id="menu-slides-button"
        className={`link textButton ${styles.menuSlidesButton}`}
        onClick={() => setExpanded(!expanded)}
        aria-haspopup={true}
        aria-controls="menu-slides"
        aria-expanded={expanded}
      >
        Slides
      </button>
      <ul
        id="menu-slides"
        className={styles.menuSlides}
        role="menu"
        aria-labelledby="menu-slides-button"
        aria-hidden={!expanded}
      >
        {slidesMetadata.map(({ id, title, date }) => (
          <li key={id} role="none" className={styles.menuSlideItem}>
            <FontAwesomeIcon icon={faAngleRight} fixedWidth />
            <a
              href={`/slides/${id}`}
              className={styles.menuLink}
              role="menuitem"
              target="_blank"
              rel="noopener"
            >
              {title}
            </a>
            <Time date={date} />
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
        <ul className={styles.menu}>
          <li className={styles.menuItem}>
            <FontAwesomeIcon icon={faBlog} fixedWidth className={styles.menuIcon} />
            <Link href="/blog">Blog</Link>
          </li>
          <li className={styles.menuItem}>
            <Slides />
          </li>
        </ul>
      </nav>
    </main>
  );
};

export const Home = () => {
  useTitle("🏡 ybiquitous");

  return (
    <>
      <Header />
      <Main />
    </>
  );
};
