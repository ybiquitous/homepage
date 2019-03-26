/* eslint-disable import/no-internal-modules, import/no-extraneous-dependencies */
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
import theme, { syntaxHighlighterPrism } from "@mdx-deck/themes";
/* eslint-enable import/no-internal-modules, import/no-extraneous-dependencies */

export default syntaxHighlighterPrism({ ...theme, prism: { style: okaidia } });
