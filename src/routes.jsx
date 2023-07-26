import { blogPosts, groupBlogPostsByYear, groupBlogPostsByTag } from "./blog/index.js";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Slides } from "./pages/Slides";

export const defaultRoute = () => <NotFound />;

export const routes = new Map([
  ["/", () => <Home />],
  ["/blog", () => <Blog posts={blogPosts} />],
  ["/blog/", () => <Blog posts={blogPosts} />],
  ["/slides", () => <Slides />],
  ["/slides/", () => <Slides />],
  ["*", defaultRoute],
]);

for (const blog of blogPosts) {
  routes.set(blog.path, () => <BlogPost {...blog} />);
  routes.set(`${blog.path}/`, () => <BlogPost {...blog} />);
}

for (const [year, posts] of groupBlogPostsByYear(blogPosts)) {
  routes.set(`/blog/${year}`, () => <Blog posts={posts} title={`${year}`} />);
  routes.set(`/blog/${year}/`, () => <Blog posts={posts} title={`${year}`} />);
}

for (const [tag, posts] of groupBlogPostsByTag(blogPosts)) {
  routes.set(`/blog/tags/${tag}`, () => <Blog posts={posts} title={`Tag #${tag}`} />);
  routes.set(`/blog/tags/${tag}/`, () => <Blog posts={posts} title={`Tag #${tag}`} />);
}
