/**
 * @param {HTMLElement} el
 * @returns {void}
 */
export function replaceSpeakerdeck(el) {
  for (const deck of el.querySelectorAll(".speakerdeck-iframe")) {
    // if (!(deck instanceof HTMLElement)) continue;

    // const newDeck = deck.clone(true)
    // debugger
    deck.parentElement?.replaceWith(deck);
  }
}
