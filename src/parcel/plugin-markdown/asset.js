/* eslint-disable @typescript-eslint/no-var-requires */
const { Asset } = require("parcel-bundler");
const marked = require("marked");
const hljs = require("highlight.js");
/* eslint-enable @typescript-eslint/no-var-requires */

const markedOptions = {
  breaks: true,
  highlight: (code, lang) => (lang ? hljs.highlight(lang, code).value : code),
};

class MarkdownAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = "html";
    this.hmrPageReload = true;
  }

  generate() {
    return marked(this.contents, markedOptions);
  }
}

module.exports = MarkdownAsset;
