import React from "react";
import { blogs } from "./blog/index";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Slides } from "./pages/Slides";

type Routes = Record<string, () => JSX.Element>;

const blogRoutes: Routes = blogs.reduce(
  (newRoutes, blog) => ({
    ...newRoutes,
    [`/blog/${blog.id}`]: () => <BlogPost {...blog} />,
  }),
  {}
);

export const routes: Routes = {
  "/": () => <Home />,
  "/blog": () => <Blog />,
  ...blogRoutes,
  "/slides": () => <Slides />,
  "*": () => <NotFound />,
};
