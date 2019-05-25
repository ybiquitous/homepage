interface BlogMetadata {
  id: string;
  title: string;
  published: Date | null;
  lastUpdated: Date | null;
}

declare module "~blog/metadata.yml" {
  const metadata: BlogMetadata[];
  export default metadata;
}
