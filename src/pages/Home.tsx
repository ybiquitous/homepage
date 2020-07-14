import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faImages, faBlog, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "../router";
import { useExternalLinkAsNewTab, useTitle } from "../utils";
import s from "./Home.css";

const Profile = () => {
  return (
    <div className={s.profile}>
      <div>
        <img
          className={s.profileImage}
          src="https://www.gravatar.com/avatar/515b5bb81e946fd400e18de5c4d0763f?s=240"
          alt="Avatar"
        />
      </div>
      <div className={s.profileCaption}>
        <strong>Masafumi Koba</strong>
        <small className={s.profileDescription}>
          Web Developer. I love Emacs, JavaScript, CSS, and Ruby. <br />
          <FontAwesomeIcon icon={faMapMarkerAlt} /> Tokyo, Japan
        </small>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <header>
      <h1>
        <a href="/" className={s.headerLink}>
          @ybiquitous
        </a>
      </h1>
      <Profile />
    </header>
  );
};

const MenuIcon = ({ icon }: { icon: IconProp }) => {
  return <FontAwesomeIcon icon={icon} fixedWidth className={s.menuIcon} />;
};

const Main = () => {
  useExternalLinkAsNewTab();

  return (
    <main>
      <nav>
        <ul className={s.menu}>
          <li className={s.menuItem}>
            <a className={s.menuLink} href="https://github.com/ybiquitous">
              <MenuIcon icon={faGithub} />
              Works
            </a>
          </li>
          <li className={s.menuItem}>
            <a className={s.menuLink} href="https://twitter.com/ybiquitous">
              <MenuIcon icon={faTwitter} />
              Tweets
            </a>
          </li>
          <li className={s.menuItem}>
            <Link className={s.menuLink} href="/blog">
              <MenuIcon icon={faBlog} />
              Blog
            </Link>
          </li>
          <li className={s.menuItem}>
            <Link className={s.menuLink} href="/slides">
              <MenuIcon icon={faImages} />
              Slides
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

export const Home = () => {
  useTitle();

  return (
    <>
      <Header />
      <Main />
    </>
  );
};
