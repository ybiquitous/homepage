/* eslint-env node */
/* eslint-disable import/no-extraneous-dependencies */
import * as fs from "node:fs/promises";

import { globSync } from "glob";
import { literal, parent } from "mdast-util-assert";
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
        parent(tree);

        const yamlNode = tree.children.find(({ type }) => type === "yaml");
        if (yamlNode === undefined) {
          reject(new Error(`No front matter in ${file}`));
          return;
        }
        literal(yamlNode);

        const h1 = tree.children.find((child) => child.type === "heading" && child.depth === 1);
        if (h1 === undefined) {
          reject(new Error(`No h1 in ${file}`));
          return;
        }
        parent(h1);

        const [h1Child] = h1.children;
        literal(h1Child);

        /** @type {{ slug: string; title: string; tags?: string | string[]; }} */
        const metadata = yaml.parse(yamlNode.value); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        metadata.slug = file.replace(/\.md$/u, "").split("/").slice(-2).join("/");
        metadata.title = h1Child.value;
        metadata.tags = (metadata.tags?.toString() ?? "")
          .split(/\s{0,10},\s{0,10}/u)
          .filter((tag) => tag.trim().length > 0)
          .sort((a, b) => a.localeCompare(b));

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
  const files = globSync(inputPattern);
  const list = await Promise.all(files.map(processFile));

  /**
   * @typedef {{ published: string | null }} MetaEntry
   * @type {(a: MetaEntry, b: MetaEntry) => number}
   */
  const byPublished = (a, b) => {
    if (a.published === null || b.published === null) {
      return 0;
    }
    return Date.parse(a.published) - Date.parse(b.published);
  };
  list.sort(byPublished);

  const content = `export default ${JSON.stringify(list, null, 2)}`;
  await fs.writeFile(outputFile, content);
}

main(process.argv[2], process.argv[3]);
