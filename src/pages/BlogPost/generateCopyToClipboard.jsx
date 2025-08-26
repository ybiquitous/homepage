import { createRoot } from "react-dom/client";
import { CopyToClipboard } from "../../components/CopyToClipboard";

/**
 * @param {HTMLElement} el
 * @returns {void}
 */
export function generateCopyToClipboard(el) {
  el.querySelectorAll("pre").forEach((pre) => {
    // Insert a wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "relative";
    pre.replaceWith(wrapper);
    wrapper.appendChild(pre);

    // Insert a button
    const btnWrapper = document.createElement("div");
    btnWrapper.className = "absolute top-2 right-2";
    btnWrapper.hidden = true;
    wrapper.appendChild(btnWrapper);
    wrapper.onmouseenter = () => {
      btnWrapper.hidden = false;
    };
    wrapper.onmouseleave = () => {
      btnWrapper.hidden = true;
    };

    // Mount
    createRoot(btnWrapper).render(<CopyToClipboard text={pre.textContent} />);
  });
}
