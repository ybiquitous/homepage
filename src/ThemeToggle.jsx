import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { assert, useMount } from "./utils";

/**
 * @returns {boolean}
 */
const initialDark = () =>
  localStorage.getItem("theme") === "dark" ||
  window.matchMedia("(prefers-color-scheme: dark)").matches;

/**
 * @param {boolean} dark
 * @returns {boolean}
 */
const toggle = (dark) => {
  document.documentElement.classList.toggle("dark", dark);

  const themeLight = document.head.querySelector("link[href^='/theme-light']");
  assert(themeLight instanceof HTMLLinkElement);
  const themeDark = document.head.querySelector("link[href^='/theme-dark']");
  assert(themeDark instanceof HTMLLinkElement);

  if (dark) {
    themeLight.disabled = true;
    themeDark.disabled = false;
  } else {
    themeLight.disabled = false;
    themeDark.disabled = true;
  }

  if (dark) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.removeItem("theme");
  }

  return dark;
};

export const ThemeToggle = () => {
  const [dark, setDark] = useState(initialDark);

  useMount(() => {
    toggle(dark);
  });

  /**
   * @param {boolean} value
   */
  const handleClick = (value) => {
    setDark(toggle(value));
  };

  return (
    <span>
      <button type="button" title="Light" onClick={() => handleClick(false)}>
        <FontAwesomeIcon
          icon={solid("sun")}
          className={dark ? "text-slate-400" : "text-orange-400"}
        />
      </button>

      <span className="text-slate-200 mx-1">|</span>

      <button type="button" title="Dark" onClick={() => handleClick(true)}>
        <FontAwesomeIcon
          icon={solid("moon")}
          className={dark ? "text-yellow-400" : "text-slate-400"}
        />
      </button>
    </span>
  );
};
