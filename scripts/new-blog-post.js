/* eslint-disable no-console, max-lines-per-function, max-statements */
import * as fs from "node:fs";
import * as path from "node:path";
import { stdin as input, stdout as output } from "node:process";
import * as readline from "node:readline/promises";
import { styleText } from "node:util";

const projectRoot = path.resolve(import.meta.dirname, "..");
const blogRoot = path.resolve(projectRoot, "src/blog");

async function main() {
  const rl = readline.createInterface({ input, output });

  try {
    const publishedTime = new Date();
    publishedTime.setHours(publishedTime.getHours() + 3);
    const thisYear = publishedTime.getFullYear();
    const thisYearDir = path.resolve(blogRoot, `${thisYear}`);

    const title = await rl.question(styleText("bold", "Title? "));
    const slug = title
      .trim()
      .replaceAll(/[!?()]/gu, "")
      .replaceAll(/\s+/gu, "-")
      .toLowerCase();
    const blogFile = path.resolve(thisYearDir, `${slug}.md`);
    const blogFileRelative = path.relative(projectRoot, blogFile);

    if (fs.existsSync(blogFile)) {
      const yesNo = await rl.question(
        `${styleText("bold", blogFileRelative)} already exists. Overwrite? [y/N] `,
      );

      if (yesNo.toLowerCase() !== "y") {
        console.log("Abort.");
        return;
      }
    }

    const tags = (await rl.question(styleText("bold", "Tags? ")))
      .trim()
      .split(/[\s,]+/u)
      .filter(Boolean);

    const yesNo = await rl.question(`Write ${styleText("bold", blogFileRelative)}? [Y/n] `);

    if (yesNo.toLowerCase() === "n") {
      console.log("Abort.");
      return;
    }

    if (!fs.existsSync(thisYearDir)) {
      fs.mkdirSync(thisYearDir);
    }

    const blogContent = `
---
published: ${publishedTime.toISOString()}
lastUpdated: null
author: Masafumi Koba
tags: ${tags.join(", ")}
---

# ${title}
`.trimStart();

    fs.writeFileSync(blogFile, blogContent);

    console.log("Done.");
  } finally {
    rl.close();
  }
}

main();
/* eslint-enable no-console, max-lines-per-function, max-statements */
