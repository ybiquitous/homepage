/* eslint-disable import/no-internal-modules, import/no-extraneous-dependencies */
import okaidia from "react-syntax-highlighter/styles/prism/okaidia";
import theme from "mdx-deck/themes";
/* eslint-enable import/no-internal-modules, import/no-extraneous-dependencies */

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ...theme,
  prism: { style: okaidia },
};
