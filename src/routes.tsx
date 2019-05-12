import React from "react";
import { Home } from "./Home";
import { Blog } from "./Blog";
import { BlogPost } from "./BlogPost";
import { blogs } from "./blog/index";
import { NotFound } from "./NotFound";
import { Routes } from "./router";

const blogRoutes = blogs.reduce(
  (newRoutes: Routes, blog) => ({
    ...newRoutes,
    [`/blog/${blog.id}`]: () => <BlogPost {...blog} />,
  }),
  {}
);

export const routes = {
  "/": () => <Home />,
  "/blog": () => <Blog />,
  ...blogRoutes,
  "*": () => <NotFound />,
};
