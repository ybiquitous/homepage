import React from "react";
import { Home } from "./pages/Home";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { blogs } from "./blog/index";
import { Slides } from "./pages/Slides";
import { NotFound } from "./pages/NotFound";

type Routes = {
  [key: string]: () => JSX.Element;
};

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
