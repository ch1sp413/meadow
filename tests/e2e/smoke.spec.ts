import { expect, test } from "@playwright/test";

test("login page renders the Meadow brand and auth controls", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("heading", { name: "Meadow" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Send magic link" })).toBeVisible();
});
