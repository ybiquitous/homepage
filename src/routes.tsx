import React from "react";
import { Home } from "./Home";
import { Blog } from "./Blog";
import { BlogPost } from "./BlogPost";
import { blogs } from "./blog/index";
import { NotFound } from "./NotFound";

interface Routes {
  [key: string]: () => JSX.Element;
}

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
  "*": () => <NotFound />,
};
