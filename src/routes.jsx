import { blogs } from "./blog/index";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Slides } from "./pages/Slides";

/** @typedef {Record<string, () => JSX.Element>} Routes */

/** @type {Routes} */
const blogRoutes = blogs.reduce(
  (newRoutes, blog) => ({
    ...newRoutes,
    [`/blog/${blog.id}`]: () => <BlogPost {...blog} />,
  }),
  {}
);

/** @type {Routes} */
export const routes = {
  "/": () => <Home />,
  "/blog": () => <Blog />,
  ...blogRoutes,
  "/slides": () => <Slides />,
  "*": () => <NotFound />,
};
