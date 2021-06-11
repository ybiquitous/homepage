const { highlight } = require("highlight.js");
const marked = require("marked");
const { Asset } = require("parcel-bundler");

class MarkdownAsset extends Asset {
  constructor(name, options) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super(name, options);
    this.type = "html";
    this.hmrPageReload = true;
  }

  generate() {
    class MyRenderer extends marked.Renderer {
      link(href, title, text) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
        return super.link(href == null ? href : href.replace(/\.md$/u, ""), title, text);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return marked(this.contents, {
      breaks: true,
      highlight(code, lang) {
        return typeof lang === "string" && lang.length > 0
          ? highlight(code, { language: lang }).value
          : code;
      },
      renderer: new MyRenderer(),
    });
  }
}

module.exports = MarkdownAsset;
