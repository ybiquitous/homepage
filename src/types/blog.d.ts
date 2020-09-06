type BlogMetadata = {
  id: string;
  title: string;
  published: Date | null;
  lastUpdated: Date | null;
  author: string;
  tags: readonly string[];
};

declare module "~blog/metadata.yml" {
  const metadata: BlogMetadata[];
  export default metadata;
}
