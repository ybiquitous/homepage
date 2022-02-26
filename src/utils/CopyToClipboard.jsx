import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const INITIAL = "initial";
const SUCCEEDED = "succeeded";
const FAILED = "failed";

/**
 * @param {{ text: string }} props
 */
export const CopyToClipboard = ({ text }) => {
  const [state, setState] = useState(INITIAL);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState(SUCCEEDED);
    } catch (e) {
      setState(FAILED);
    } finally {
      setTimeout(() => setState(INITIAL), 2000);
    }
  };

  let style = "text-gray-300 hover:text-gray-500";
  let icon = solid("copy");
  let message;
  if (state === SUCCEEDED) {
    style = "text-emerald-500";
    icon = solid("check");
    message = "Copied!";
  } else if (state === FAILED) {
    style = "text-red-500";
    icon = solid("xmark");
    message = "Failed to copy.";
  }

  return (
    <span className="relative">
      {message != null && <span className="absolute -top-10 -right-2 mr-2">{message}</span>}
      <button
        title="Copy to Clipboard"
        onClick={handleClick}
        className={`border border-current rounded px-1 py-0.5 bg-gray-100 ${style}`}
      >
        <FontAwesomeIcon icon={icon} size="sm" fixedWidth />
      </button>
    </span>
  );
};
