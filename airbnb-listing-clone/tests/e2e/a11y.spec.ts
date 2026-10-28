import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function seriousViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  return results.violations
    .filter((violation) => violation.impact === "serious" || violation.impact === "critical")
    .map(
      (violation) =>
        `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`,
    );
}

test.describe("accessibility", () => {
  test("listing page", async ({ page }) => {
    await page.goto("/");
    expect(await seriousViolations(page)).toEqual([]);
  });

  test("photo tour", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Show all photos" }).click();
    await expect(page.getByRole("dialog", { name: "Photo tour" })).toBeVisible();
    expect(await seriousViolations(page)).toEqual([]);
  });

  test("lightbox", async ({ page }) => {
    await page.goto("/?modal=PHOTO_TOUR_SCROLLABLE&modalItem=1003");
    await expect(page.getByRole("dialog", { name: "Photo viewer" })).toBeVisible();
    expect(await seriousViolations(page)).toEqual([]);
  });

  test("amenities dialog", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Show all 50 amenities" }).click();
    await expect(page.getByRole("dialog", { name: "What this place offers" })).toBeVisible();
    expect(await seriousViolations(page)).toEqual([]);
  });
});
