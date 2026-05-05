import { test, expect } from "@playwright/test";

test("public profile renders", async ({ page }) => {
  await page.goto("/andi_kreasi");
  await expect(page.getByText("Andi Pratama")).toBeVisible();
});
