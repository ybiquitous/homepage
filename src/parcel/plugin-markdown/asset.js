const { Asset } = require("parcel-bundler");
const marked = require("marked");
const hljs = require("highlight.js");

class MarkdownAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = "html";
    this.hmrPageReload = true;
  }

  generate() {
    return marked(this.contents, {
      breaks: true,
      highlight: (code, lang) =>
        typeof lang === "string" ? hljs.highlight(lang, code).value : code,
    });
  }
}

module.exports = MarkdownAsset;
