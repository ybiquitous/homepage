/* eslint-env node */
/* eslint-disable import/no-extraneous-dependencies */
import * as fs from "node:fs/promises";
import glob from "glob";
import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import yaml from "yaml";
/* eslint-enable import/no-extraneous-dependencies */

/**
 * @param {string} file
 */
async function processFile(file) {
  const content = await fs.readFile(file, "utf-8");

  return new Promise((resolve, reject) => {
    unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(remarkFrontmatter, ["yaml"])
      .use(() => (tree) => {
        const yamlNode = tree.children.find(({ type }) => type === "yaml");
        if (yamlNode === undefined) {
          reject(new Error(`No front matter in ${file}`));
          return;
        }

        if (!("value" in yamlNode && typeof yamlNode.value === "string")) {
          reject(new Error(`Invalid front matter in ${file}`));
          return;
        }

        // @ts-expect-error -- TS2339: Property 'depth' does not exist on type 'Content'.
        const h1 = tree.children.find(({ type, depth }) => type === "heading" && depth === 1);
        if (h1 === undefined) {
          reject(new Error(`No h1 in ${file}`));
          return;
        }

        /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
        const metadata = yaml.parse(yamlNode.value);
        metadata.slug = file.replace(/\.md$/u, "").split("/").slice(-2).join("/");
        // @ts-expect-error -- TS2339: Property 'children' does not exist on type 'Content'.
        metadata.title = h1.children[0].value;
        metadata.tags = (metadata.tags ?? "")
          .split(/\s{0,10},\s{0,10}/u)
          .filter((/** @type {string} */ tag) => tag.trim().length > 0)
          .sort((/** @type {string} */ a, /** @type {string} */ b) => a.localeCompare(b));

        /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */

        resolve(metadata);
      })
      .process(content);
  });
}

/**
 * @param {string | undefined} inputPattern
 * @param {string | undefined} outputFile
 */
async function main(inputPattern = "", outputFile = "") {
  const files = glob.sync(inputPattern);
  const list = await Promise.all(files.map(processFile));

  /**
   * @typedef {{ published: string | null }} MetaEntry
   * @type {(a: MetaEntry, b: MetaEntry) => number}
   */
  const byLastPublished = (a, b) => {
    if (a.published === null || b.published === null) {
      return 0;
    }
    return Date.parse(b.published) - Date.parse(a.published);
  };
  list.sort(byLastPublished);

  const content = `export default ${JSON.stringify(list, null, 2)}`;
  await fs.writeFile(outputFile, content);
}

main(process.argv[2], process.argv[3]);
