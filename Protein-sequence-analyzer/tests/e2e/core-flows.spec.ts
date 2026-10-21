import { expect, test } from "@playwright/test";

test("analyzes valid and invalid input", async ({ page }) => {
  await page.goto("/");
  const input = page.getByRole("textbox", { name: "Protein sequence input" });
  await input.fill(">sample\nACD");
  await page.getByRole("button", { name: "Analyze sequence" }).first().click();
  await expect(page.getByText("3 aa")).toBeVisible();
  await input.fill("ACD!");
  await page.getByRole("button", { name: "Analyze sequence" }).first().click();
  await expect(page.getByRole("status")).toContainText("unsupported");
  await expect(page.getByRole("button", { name: "Save valid sequence" })).toBeDisabled();
});

test("saves and compares two proteins", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Save valid sequence" }).click();
  await page.getByRole("button", { name: "Compact enzymeBalanced composition example" }).click();
  await page.getByRole("button", { name: "Save valid sequence" }).click();
  await page.getByRole("button", { name: "Saved", exact: true }).click();
  await page.getByRole("checkbox").nth(0).check();
  await page.getByRole("checkbox").nth(1).check();
  await page.getByRole("button", { name: "Compare selected" }).click();
  await page.getByRole("button", { name: "Compare", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Comparison and alignment" })).toBeVisible();
  await expect(page.getByText(/Needleman-Wunsch/)).toBeVisible();
});
