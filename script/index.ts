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

let interactions: Interaction[] = [
  {
    eventName: "DOMContentLoaded",
    timestamp: performance.now(),
  },
];

type DomInteraction = {
  eventName: keyof HTMLElementEventMap;
  target: string;
  event: UIEvent;
  timestamp: number;
};

type LoadedInteraction = {
  eventName: "DOMContentLoaded";
  timestamp: number;
};

type HTTPInteraction = {
  eventName: "HTTPCall";
  req: XMLHttpRequest | RequestInfo;
  method?: string;
  url?: string;
};
type Interaction = DomInteraction | LoadedInteraction | HTTPInteraction;

// function enqueueInteraction();

document.addEventListener("DOMContentLoaded", () => {
  //todo: listen to all the events
  document.body.addEventListener("click", (e) => {
    let output = getUniqueSelector(e.target as HTMLElement | null) ?? "ERROR";

    // Todo: make a proper logger  fn
    interactions.push({
      eventName: "click",
      target: output,
      event: e,
      timestamp: performance.now(),
    });
  });
});

// Interception using XMLHttpRequest
(function () {
  const open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (
    this: XMLHttpRequest,
    method: string,
    url: string
  ) {
    interactions.push({ eventName: "HTTPCall", method, url, req: this });
    return open.apply(this, arguments as any);
  };
})();

// Interception using fetch
(function () {
  const originalFetch = window.fetch;
  window.fetch = function (
    this: Window,
    input: RequestInfo,
    init?: RequestInit
  ): Promise<Response> {
    interactions.push({ eventName: "HTTPCall", req: input });
    return originalFetch.apply(this, arguments as any);
  } as typeof window.fetch;
})();

setInterval(() => {
  console.log("intreactions: ", interactions);
  if (!interactions.length) return;
  // Todo: send this to a server
  const mockRequest = fetch("http://localhost:3000/ping", {
    method: "POST",
    body: JSON.stringify(interactions),
    headers: {
      "Content-Type": "application/json",
    },
  });
  mockRequest.then(() => {
    interactions = [];
  });
}, 5000);
console.log("loaded");
