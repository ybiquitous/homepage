import { test, expect } from "@playwright/test";

test("root", async ({ page }) => {
  await page.goto("/");
  await page.click('[title="Light"]');
  await expect(page).toHaveScreenshot();
});

test("root with dark mode", async ({ page }) => {
  await page.goto("/");
  await page.click('[title="Dark"]');
  await expect(page).toHaveScreenshot();
});
