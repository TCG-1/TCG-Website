import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 90_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3100",
    browserName: "chromium",
    channel: "chrome",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  webServer: {
    command: "npm run build && npm run start -- --hostname 127.0.0.1 --port 3100",
    env: {
      ...process.env,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? "hello@tacklersconsulting.com",
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? "Hello@123",
      ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET ?? "local-dev-admin-session-secret",
    },
    reuseExistingServer: false,
    timeout: 180_000,
    url: "http://127.0.0.1:3100/sign-in",
  },
});
