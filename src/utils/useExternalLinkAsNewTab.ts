import { useEffect } from "react";

export const useExternalLinkAsNewTab = (): void => {
  useEffect(() => {
    const listener: EventListener = (event) => {
      const target = event.currentTarget;
      if (target instanceof HTMLAnchorElement) {
        target.target = "_blank";
        target.rel = "noopener";
      }
    };
    const externalLinks = Array.from(document.querySelectorAll("a[href^='http']")).filter(
      (link) => link instanceof HTMLAnchorElement && link.host !== globalThis.location.host
    );
    externalLinks.forEach((link) => link.addEventListener("click", listener));
    return () => {
      externalLinks.forEach((link) => link.removeEventListener("click", listener));
    };
  }, []);
};
