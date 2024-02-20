import { expect, selectors, test } from "@playwright/test"; // Or 'chromium' or 'webkit'.
import { writeFileSync } from "fs";
(async () => {
  // Must be a function that evaluates to a selector engine instance.
  const createTagNameEngine = () => ({
    // Returns the first element matching given selector in the root's subtree.
    query(root, selector) {
      return root.querySelector(selector);
    },

    // Returns all elements matching given selector in the root's subtree.
    queryAll(root, selector) {
      return Array.from(root.querySelectorAll(selector));
    },
  });

  // Register the engine. Selectors will be prefixed with "tag=".
  await selectors.register("tag", createTagNameEngine);
})();

test("has title", async ({ page }) => {
  await page.goto("http://127.0.0.1:9000");

  // Expect a title "to contain" a substring.
  const button = page.locator("tag=button.color");
  await expect(button).toBeVisible();
  const content = await page.content();
  writeFileSync(`snapshot-${new Date().getTime().toString()}`, content);
});
