import { expect, test } from "@playwright/test";

test.describe("listing page", () => {
  test("saving to the wishlist survives a reload", async ({ page }) => {
    await page.goto("/");
    const save = page.getByRole("button", { name: "Save", exact: true });
    await save.click();
    await expect(page.getByRole("status")).toHaveText("Saved to wishlist");
    await expect(page.getByRole("button", { name: "Saved" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await page.reload();
    await expect(page.getByRole("button", { name: "Saved" })).toBeVisible();
  });

  test("the section bar appears past the photos and tracks the current section", async ({
    page,
  }) => {
    await page.goto("/");
    const sections = page.getByRole("navigation", { name: "Listing sections" });
    // Parked above the viewport (and inert) until the photo grid scrolls away.
    await expect(sections).not.toBeInViewport();

    await page.evaluate(() => window.scrollTo({ top: 1000, behavior: "instant" }));
    await expect(sections).toBeInViewport();
    await expect(sections.getByRole("link", { name: "Photos" })).toHaveAttribute(
      "aria-current",
      "true",
    );

    await sections.getByRole("link", { name: "Reviews" }).click();
    await expect(sections.getByRole("link", { name: "Reviews" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    await expect(page.locator("#reviews")).toBeFocused();
  });

  test("picking new dates reprices the stay", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Clear dates" }).click();
    await expect(page.getByText("Add dates for prices").first()).toBeVisible();

    await page.getByRole("button", { name: /20 October 2026/ }).click();
    await page.getByRole("button", { name: /22 October 2026/ }).click();
    await expect(page.getByText("2 nights in Candolim")).toBeVisible();
    await expect(page.getByText("₹11,400").first()).toBeVisible();
  });

  test("booked nights can't be picked or stayed across", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Clear dates" }).click();
    await page.getByRole("button", { name: "Next month" }).click();

    const booked = page.getByRole("button", { name: /20 November 2026/ });
    await expect(booked).toHaveAttribute("aria-disabled", "true");
    await booked.click({ force: true });
    await expect(page.getByText("Select check-in date")).toBeVisible();

    await page.getByRole("button", { name: /16 November 2026/ }).click();
    await page.getByRole("button", { name: /26 November 2026/ }).click();
    // A range over booked nights restarts the selection instead of closing it.
    await expect(page.getByText("Select checkout date")).toBeVisible();
  });

  test("the amenities dialog closes on Escape and returns focus", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Show all 50 amenities" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "What this place offers" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("nearby stays page through with the arrows", async ({ page }) => {
    await page.goto("/");
    const next = page.getByRole("button", { name: "Next stays" });
    const previous = page.getByRole("button", { name: "Previous stays" });
    await next.scrollIntoViewIfNeeded();
    await expect(previous).toBeDisabled();
    await next.click();
    await expect(next).toBeDisabled();
    await expect(previous).toBeEnabled();
    await expect(page.getByText("Page 2 / 2")).toBeAttached();
  });
});
