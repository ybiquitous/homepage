const { Asset } = require("parcel-bundler");
const marked = require("marked");
const hljs = require("highlight.js");

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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        return super.link(href.replace(/\.md$/u, ""), title, text);
      }
    }

    return marked(this.contents, {
      breaks: true,
      highlight(code, lang) {
        return typeof lang === "string" && lang.length > 0
          ? hljs.highlight(code, { language: lang }).value
          : code;
      },
      renderer: new MyRenderer(),
    });
  }
}

module.exports = MarkdownAsset;
