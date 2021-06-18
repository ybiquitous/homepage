// @ts-expect-error
const { highlight } = require("highlight.js");
const marked = require("marked");
// @ts-expect-error
const { Asset } = require("parcel-bundler");

class MarkdownAsset extends Asset {
  // @ts-expect-error
  constructor(name, options) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super(name, options);
    this.type = "html";
    this.hmrPageReload = true;
  }

  generate() {
    class MyRenderer extends marked.Renderer {
      /**
       * @param {string | null} href
       * @param {string | null} title
       * @param {string} text
       */
      link(href, title, text) {
        return super.link(href == null ? href : href.replace(/\.md$/u, ""), title, text);
      }
    }

    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return marked(this.contents, {
      breaks: true,
      highlight(code, lang) {
        return typeof lang === "string" && lang.length > 0 // eslint-disable-line @typescript-eslint/no-unsafe-return
          ? highlight(code, { language: lang }).value // eslint-disable-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          : code;
      },
      renderer: new MyRenderer(),
    });
  }
}

module.exports = MarkdownAsset;
