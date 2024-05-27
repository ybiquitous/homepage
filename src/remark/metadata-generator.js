/* eslint-disable import/no-extraneous-dependencies */
import assert from "node:assert/strict";
// @ts-expect-error -- TS2305: Module '"node:fs"' has no exported member 'globSync'.
import { globSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import process from "node:process";

import { literal, parent } from "mdast-util-assert";
import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { readSync } from "to-vfile";
import { unified } from "unified";
import yaml from "yaml";
/* eslint-enable import/no-extraneous-dependencies */

/** @typedef {import('mdast').Root} Root */
/** @typedef {import('vfile').VFile} VFile */

/** @type {() => (tree: Root, file: VFile) => void} */
function extractMetadata() {
  return (tree, file) => {
    parent(tree);

    const yamlNode = tree.children.find(({ type }) => type === "yaml");
    if (yamlNode === undefined) {
      file.fail(new Error(`No front matter in ${file.path}`));
    }
    literal(yamlNode);

    const h1 = tree.children.find((child) => child.type === "heading" && child.depth === 1);
    if (h1 === undefined) {
      file.fail(new Error(`No h1 in ${file.path}`));
    }
    parent(h1);

    const [h1Child] = h1.children;
    literal(h1Child);

    /** @type {{ slug: string; title: string; tags?: string | string[]; }} */
    const metadata = yaml.parse(yamlNode.value); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    metadata.slug = file.path.replace(/\.md$/u, "").split("/").slice(-2).join("/");
    metadata.title = h1Child.value;
    metadata.tags = (metadata.tags?.toString() ?? "")
      .split(/\s{0,10},\s{0,10}/u)
      .filter((tag) => tag.trim().length > 0)
      .sort((a, b) => a.localeCompare(b));

    file.data = metadata; // eslint-disable-line no-param-reassign
  };
}

/**
 * @param {string} filePath
 */
async function processFile(filePath) {
  return unified()
    .use(remarkParse)
    .use(remarkStringify)
    .use(remarkFrontmatter, ["yaml"])
    .use(extractMetadata)
    .process(readSync(filePath));
}

/**
 * @param {string} inputPattern
 * @param {string} outputFile
 */
async function main(inputPattern, outputFile) {
  const files = globSync(inputPattern);
  const vFiles = await Promise.all(files.map(processFile));
  // @ts-expect-error -- TS7006: Parameter 'vFile' implicitly has an 'any' type.
  const metadataList = vFiles.map((vFile) => vFile.data);

  /** @typedef {import('vfile').Data} Data */
  /** @type {(a: Data, b: Data) => number} */
  const byPublished = (a, b) => {
    const aPublished = a["published"] ?? "1970-01-01T00:00:00.000Z";
    const bPublished = b["published"] ?? "1970-01-01T00:00:00.000Z";
    assert(typeof aPublished === "string");
    assert(typeof bPublished === "string");
    return Date.parse(aPublished) - Date.parse(bPublished);
  };
  metadataList.sort(byPublished);

  const content = `export default ${JSON.stringify(metadataList, null, 2)}`;
  await writeFile(outputFile, content, "utf-8");
  process.stdout.write(`Wrote ${outputFile}\n`);
}

main("src/blog/**/*.md", "src/blog/metadata.js");
