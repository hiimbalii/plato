/**************
 *
 * Find unique selector code
 * TODO: Rewrite ( This is a PoC by ChatGPT )
 *
 */
function getUniqueSelector(element: HTMLElement | null): string | null {
  if (!element || !element.tagName) return null;

  let selector = element.tagName.toLowerCase();

  if (element.id) {
    selector += `#${element.id}`;
    return selector;
  }

  if (element.className) {
    const classes = element.className.split(/\s+/);
    for (let i = 0; i < classes.length; i++) {
      selector += `.${classes[i]}`;
    }
  }

  const siblings = element.parentNode?.querySelectorAll(selector);
  if (siblings && siblings.length > 1) {
    for (let i = 0; i < siblings.length; i++) {
      if (siblings[i] === element) {
        selector += `:nth-child(${i + 1})`;
        break;
      }
    }
  }

  return selector;
}

/***********
 *
 * Logging
 *
 */

const interactions = [
  {
    eventName: "DOMContentLoaded",
    target: "",
    event: null as any,
    timestamp: performance.now(),
  },
];

document.addEventListener("DOMContentLoaded", () => {
  //todo: listen to all the events
  document.body.addEventListener("click", (e) => {
    let output = getUniqueSelector(e.target as HTMLElement | null) ?? "ERROR";

    // Todo: make a proper logger  fn
    interactions.push({
      eventName: "click",
      target: output,
      event: e as any,
      timestamp: performance.now(),
    });
  });
});

// setInterval(() => {
//   // Todo: send this to a server
//   console.log(interactions)
// }, 5000)
