import React from "react";
import { Home } from "./Home";
import { Blog } from "./Blog";
import { BlogPost } from "./BlogPost";
import blogMetadata from "~blog/metadata.yml";
import blogStartBlog from "./blog/start-blog.md";
import { NotFound } from "./NotFound";
import { Routes } from "./router";

const blogRoutes = blogMetadata.reduce(
  (newRoutes: Routes, meta) => ({
    ...newRoutes,
    [`/blog/${meta.id}`]: () => <BlogPost {...meta} content={blogStartBlog} />,
  }),
  {}
);

export const routes = {
  "/": () => <Home />,
  "/blog": () => <Blog />,
  ...blogRoutes,
  "*": () => <NotFound />,
};
