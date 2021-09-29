import { faCheck, faClone, faTimes } from "@fortawesome/free-solid-svg-icons";
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
      setTimeout(() => setState(INITIAL), 3000);
    }
  };

  let style = "hover:border-white text-gray-500";
  let icon = faClone;
  if (state === SUCCEEDED) {
    style = "text-green-400";
    icon = faCheck;
  } else if (state === FAILED) {
    style = "text-red-400";
    icon = faTimes;
  }

  return (
    <button
      title="Copy to Clipboard"
      onClick={handleClick}
      className={`border border-current rounded px-1 py-0.5 ${style}`}
    >
      <FontAwesomeIcon icon={icon} size="sm" fixedWidth />
    </button>
  );
};
