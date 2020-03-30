type SlideMetadata = {
  id: string;
  title: string;
  date: Date;
};

declare module "~slides/metadata.yml" {
  const metadata: SlideMetadata[];
  export default metadata;
}
