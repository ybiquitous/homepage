import { blogPosts, groupBlogPostsByYear, groupBlogPostsByTag } from "./blog/index.js";
import { Link } from "./components/Link";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { BlogTags } from "./pages/BlogTags";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Slides } from "./pages/Slides";

export const defaultRoute = () => <NotFound />;

const blogPostsByTag = groupBlogPostsByTag(blogPosts);

export const routes = new Map([
  ["/", () => <Home />],
  ["/blog", () => <Blog posts={blogPosts} breadcrumbs={[]} />],
  ["/blog/", () => <Blog posts={blogPosts} breadcrumbs={[]} />],
  ["/blog/tags", () => <BlogTags postsByTag={blogPostsByTag} />],
  ["/blog/tabs/", () => <BlogTags postsByTag={blogPostsByTag} />],
  ["/slides", () => <Slides />],
  ["/slides/", () => <Slides />],
  ["*", defaultRoute],
]);

for (const blog of blogPosts) {
  routes.set(blog.path, () => <BlogPost {...blog} />);
  routes.set(`${blog.path}/`, () => <BlogPost {...blog} />);
}

for (const [year, posts] of groupBlogPostsByYear(blogPosts)) {
  const breadcrumbs = [`${year}`];
  routes.set(`/blog/${year}`, () => <Blog posts={posts} breadcrumbs={breadcrumbs} />);
  routes.set(`/blog/${year}/`, () => <Blog posts={posts} breadcrumbs={breadcrumbs} />);
}

for (const [tag, posts] of blogPostsByTag) {
  const breadcrumbs = [{ key: "Tags", el: <Link href="/blog/tags">Tags</Link> }, `#${tag}`];
  routes.set(`/blog/tags/${tag}`, () => <Blog posts={posts} breadcrumbs={breadcrumbs} />);
  routes.set(`/blog/tags/${tag}/`, () => <Blog posts={posts} breadcrumbs={breadcrumbs} />);
}
