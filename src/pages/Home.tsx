import { faGithub, faNpm, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faBlog, faGem, faImages, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { Link } from "../router";
import { useExternalLinkAsNewTab, useTitle } from "../utils";
import s from "./Home.css";

const Profile = () => (
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

const Header = () => (
  <header>
    <h1>
      <a href="/" className={s.headerLink}>
        @ybiquitous
      </a>
    </h1>
    <Profile />
  </header>
);

const MenuIcon = ({ icon }: Pick<FontAwesomeIconProps, "icon">) => (
  <FontAwesomeIcon icon={icon} fixedWidth className={s.menuIcon} />
);

const Main = () => {
  useExternalLinkAsNewTab();

  return (
    <main>
      <nav>
        <ul className={s.menu}>
          <li className={s.menuItem}>
            <a className={s.menuLink} href="https://github.com/ybiquitous">
              <MenuIcon icon={faGithub} />
              GitHub
            </a>
          </li>
          <li className={s.menuItem}>
            <a className={s.menuLink} href="https://www.npmjs.com/~ybiquitous">
              <MenuIcon icon={faNpm} />
              npm
            </a>
          </li>
          <li className={s.menuItem}>
            <a className={s.menuLink} href="https://rubygems.org/profiles/ybiquitous">
              <MenuIcon icon={faGem} />
              RubyGems
            </a>
          </li>
          <li className={s.menuItem}>
            <a className={s.menuLink} href="https://twitter.com/ybiquitous">
              <MenuIcon icon={faTwitter} />
              Twitter
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
