import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PORT ?? 3000);
const baseURL = process.env.BASE_URL ?? `http://localhost:${port}`;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
    // Same desktop window the reference screenshots were taken in.
    viewport: { width: 1366, height: 768 },
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1366, height: 768 },
        launchOptions: { executablePath: process.env.PW_CHROMIUM_PATH || undefined },
      },
    },
  ],
  // Tests run against the production build; `npm run build` first.
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `npm run start -- -p ${port}`,
        url: baseURL,
        reuseExistingServer: true,
        timeout: 60_000,
      },
});
