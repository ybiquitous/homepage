import { blogs } from "./blog/index";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Slides } from "./pages/Slides";

export const defaultRoute = () => <NotFound />;

export const routes = new Map([
  ["/", () => <Home />],
  ["/blog", () => <Blog />],
  ["/blog/", () => <Blog />],
  ["/slides", () => <Slides />],
  ["/slides/", () => <Slides />],
  ["*", defaultRoute],
]);

for (const blog of blogs) {
  routes.set(blog.path, () => <BlogPost {...blog} />);
  routes.set(`${blog.path}/`, () => <BlogPost {...blog} />);
}
