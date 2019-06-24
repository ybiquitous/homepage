/* eslint-disable import/no-extraneous-dependencies */
import theme, { syntaxHighlighterPrism } from "@mdx-deck/themes";
/* eslint-enable import/no-extraneous-dependencies */

const customeTheme = {
  ...theme,
  ...syntaxHighlighterPrism(theme),
};

export default customeTheme;
