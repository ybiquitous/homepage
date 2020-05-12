/* eslint-disable import/no-extraneous-dependencies */
import theme, { syntaxHighlighterPrism } from "@mdx-deck/themes";
/* eslint-enable import/no-extraneous-dependencies */

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
const customeTheme = {
  ...theme,
  ...syntaxHighlighterPrism(theme),
};
/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */

export default customeTheme;
