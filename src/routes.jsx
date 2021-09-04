import { blogs } from "./blog/index.js";
import { Blog } from "./pages/Blog.jsx";
import { BlogPost } from "./pages/BlogPost.jsx";
import { Home } from "./pages/Home.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import { Slides } from "./pages/Slides.jsx";

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
