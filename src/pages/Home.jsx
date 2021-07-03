import { faGithub, faNpm, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faBlog, faGem, faImages } from "@fortawesome/free-solid-svg-icons";
import { useTitle } from "../utils";
import { Header } from "./Home/Header";
import { Profile } from "./Home/Profile";
import { Menu } from "./Home/Menu";

export const Home = () => {
  useTitle();

  return (
    <>
      <Header>
        <div className="mt-16">
          <Profile />
        </div>
      </Header>

      <main className="mt-24 mb-32">
        <nav>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            <Menu link="/blog" icon={faBlog} content="Blog" />
            <Menu link="/slides" icon={faImages} content="Slides" />
            <Menu
              link="https://github.com/ybiquitous"
              icon={faGithub}
              content="GitHub"
              subContent="@ybiquitous"
            />
            <Menu
              link="https://twitter.com/ybiquitous"
              icon={faTwitter}
              content="Twitter"
              subContent="@ybiquitous"
            />
            <Menu link="https://www.npmjs.com/~ybiquitous" icon={faNpm} content="npm" />
            <Menu link="https://rubygems.org/profiles/ybiquitous" icon={faGem} content="RubyGems" />
          </div>
        </nav>
      </main>
    </>
  );
};
