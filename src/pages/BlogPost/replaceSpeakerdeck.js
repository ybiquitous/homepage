/**
 * @param {HTMLElement} el
 * @returns {void}
 */
export function replaceSpeakerdeck(el) {
  for (const deck of el.querySelectorAll(".speakerdeck-iframe")) {
    deck.parentElement?.replaceWith(deck);
  }
}
