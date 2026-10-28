import { expect, test } from "@playwright/test";

test.describe("photo tour and lightbox", () => {
  test("a hero photo opens the tour on that photo, and Escape hands focus back", async ({
    page,
  }) => {
    await page.goto("/");
    const heroPhoto = page.getByRole("button", { name: "Open the photo tour at Bedroom" });
    await heroPhoto.click();

    const tour = page.getByRole("dialog", { name: "Photo tour" });
    await expect(tour).toBeVisible();
    await expect(page).toHaveURL(/modal=PHOTO_TOUR_SCROLLABLE/);
    await expect(tour.getByRole("button", { name: "Back" })).toBeFocused();
    await expect(tour.locator('[data-photo-id="bedroom-01"]')).toBeInViewport();

    await page.keyboard.press("Escape");
    await expect(tour).toBeHidden();
    await expect(page).not.toHaveURL(/modal=/);
    await expect(heroPhoto).toBeFocused();
  });

  test("Tab stays inside the open tour", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Show all photos" }).click();
    const tour = page.getByRole("dialog", { name: "Photo tour" });
    await expect(tour).toBeVisible();

    await page.keyboard.press("Shift+Tab");
    const focusedInsideTour = await tour.evaluate((dialog) =>
      dialog.contains(document.activeElement),
    );
    expect(focusedInsideTour).toBe(true);
  });

  test("the lightbox pages with arrow keys and stops at the ends", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Show all photos" }).click();
    await page.getByRole("button", { name: "Living room 1, photo 1 of 43" }).click();

    const viewer = page.getByRole("dialog", { name: "Photo viewer" });
    await expect(viewer).toBeVisible();
    await expect(viewer.getByText("1 of 43")).toBeVisible();
    await expect(viewer.getByRole("button", { name: "Previous" })).toBeDisabled();
    await expect(page).toHaveURL(/modalItem=1000/);

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expect(viewer.getByText("3 of 43")).toBeVisible();
    await expect(page).toHaveURL(/modalItem=1002/);

    await page.keyboard.press("ArrowLeft");
    await expect(viewer.getByText("2 of 43")).toBeVisible();
  });

  test("Escape in the lightbox goes back to the tour, not the page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Show all photos" }).click();
    await page.getByRole("button", { name: "Living room 1, photo 2 of 43" }).click();
    await expect(page.getByRole("dialog", { name: "Photo viewer" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Photo viewer" })).toBeHidden();
    await expect(page.getByRole("dialog", { name: "Photo tour" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Living room 1, photo 2 of 43" })).toBeFocused();
  });

  test("the browser back button closes overlays one at a time", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Show all photos" }).click();
    await page.getByRole("button", { name: "Living room 1, photo 1 of 43" }).click();

    await page.goBack();
    await expect(page.getByRole("dialog", { name: "Photo viewer" })).toBeHidden();
    await expect(page.getByRole("dialog", { name: "Photo tour" })).toBeVisible();

    await page.goBack();
    await expect(page.getByRole("dialog", { name: "Photo tour" })).toBeHidden();
  });

  test("a shared lightbox link opens straight on that photo", async ({ page }) => {
    await page.goto("/?modal=PHOTO_TOUR_SCROLLABLE&modalItem=1042");
    const viewer = page.getByRole("dialog", { name: "Photo viewer" });
    await expect(viewer.getByText("43 of 43")).toBeVisible();
    await expect(viewer.getByRole("button", { name: "Next" })).toBeDisabled();

    // Nothing to go back to, so closing falls back to the tour instead of leaving the site.
    await viewer.getByRole("button", { name: "Close" }).click();
    await expect(page.getByRole("dialog", { name: "Photo tour" })).toBeVisible();
    await expect(page).toHaveURL(/modal=PHOTO_TOUR_SCROLLABLE$/);
  });

  test("an out-of-range photo number falls back to the tour", async ({ page }) => {
    await page.goto("/?modal=PHOTO_TOUR_SCROLLABLE&modalItem=9999");
    await expect(page.getByRole("dialog", { name: "Photo tour" })).toBeVisible();
    await expect(page.getByRole("dialog", { name: "Photo viewer" })).toHaveCount(0);
  });
});
