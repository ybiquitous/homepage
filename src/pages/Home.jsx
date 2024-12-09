import { brands, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { buildTitle } from "../utils/buildTitle";
import { Menu } from "./Home/Menu";
import { Profile } from "./Home/Profile";

export const Home = () => {
  return (
    <>
      <title>{buildTitle()}</title>

      <header className="md:mt-24">
        <Profile />
      </header>

      <main className="py-8 md:py-24">
        <nav>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Menu link="/blog" icon={solid("blog")} content="Blog" />
            <Menu link="/slides" icon={solid("images")} content="Slides" />
            <Menu link="https://github.com/ybiquitous" icon={brands("github")} content="GitHub" />
            <Menu
              link="https://twitter.com/ybiquitous"
              icon={brands("twitter")}
              content="Twitter"
            />
            <Menu link="https://www.npmjs.com/~ybiquitous" icon={brands("npm")} content="npm" />
            <Menu
              link="https://rubygems.org/profiles/ybiquitous"
              icon={solid("gem")}
              content="RubyGems"
            />
          </div>
        </nav>
      </main>
    </>
  );
};
