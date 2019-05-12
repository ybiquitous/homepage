interface BlogMetadata {
  id: string;
  title: string;
  published: Date | null;
  modified: Date | null;
}

declare module "~blog/metadata.yml" {
  const metadata: BlogMetadata[];
  export default metadata;
}
