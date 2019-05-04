import React from "react";
import { Home } from "./Home";
import { Blog } from "./Blog";
import { BlogPost } from "./BlogPost";
import blogMetadata from "./blog/metadata.yml";
import blogStartBlog from "./blog/start-blog.md";
import { NotFound } from "./NotFound";
import { Routes } from "./router";

const blogRoutes = blogMetadata.reduce(
  (newRoutes: Routes, { id, title, published, modified }: any) => ({
    ...newRoutes,
    [`/blog/${id}`]: () => (
      <BlogPost title={title} published={published} modified={modified} content={blogStartBlog} />
    ),
  }),
  {}
);

export const routes = {
  "/": () => <Home />,
  "/blog": () => <Blog />,
  ...blogRoutes,
  "*": () => <NotFound />,
};
