# End-to-End (E2E) Acceptance Testing Strategy

This document outlines the strategy for end-to-end (E2E) acceptance testing of the KillrVideo React frontend application.

## Recommended Framework: Playwright

For E2E testing, we recommend using [Playwright](https://playwright.dev/).

### Why Playwright?

*   **Cross-browser:** It can test on Chromium (Chrome, Edge), Firefox, and WebKit (Safari).
*   **Auto-waits:** Playwright waits for elements to be actionable before performing actions, which eliminates a major source of flakiness in E2E tests.
*   **Powerful Tooling:** It includes tools like Codegen (to record tests), Playwright Inspector (to debug tests), and Trace Viewer (to see what happened during a test run).
*   **Network Interception:** It can intercept and mock network requests, which is very useful for testing various API response scenarios.

## Getting Started

1.  **Installation:**
    ```bash
    npm install @playwright/test --save-dev
    npx playwright install
    ```

2.  **Configuration:**
    Create a `playwright.config.ts` file in the root of the project.

    ```typescript
    import { defineConfig, devices } from '@playwright/test';

    export default defineConfig({
      testDir: './e2e',
      /* Run tests in files in parallel */
      fullyParallel: true,
      /* Fail the build on CI if you accidentally left test.only in the source code. */
      forbidOnly: !!process.env.CI,
      /* Retry on CI only */
      retries: process.env.CI ? 2 : 0,
      /* Opt out of parallel tests on CI. */
      workers: process.env.CI ? 1 : undefined,
      /* Reporter to use. See https://playwright.dev/docs/test-reporters */
      reporter: 'html',
      /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
      use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: 'http://localhost:5173', // Assuming Vite's default dev server port

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
      },

      /* Configure projects for major browsers */
      projects: [
        {
          name: 'chromium',
          use: { ...devices['Desktop Chrome'] },
        },
      ],

      /* Run your local dev server before starting the tests */
      webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
      },
    });
    ```

## Initial Test Cases

Here are some initial test cases to create in the `e2e/` directory.

### 1. `e2e/auth.spec.ts`

*   **User Registration:**
    1.  Navigate to the registration page.
    2.  Fill out the registration form with a unique email.
    3.  Submit the form.
    4.  Assert that the user is redirected to the login page or a "registration successful" page.

*   **User Login and Logout:**
    1.  Create a user via API or use a pre-existing test user.
    2.  Navigate to the login page.
    3.  Fill in the login form.
    4.  Submit the form.
    5.  Assert that the user is redirected to the home page or their profile page.
    6.  Assert that user-specific elements are visible (e.g., a "logout" button or their name).
    7.  Click the logout button.
    8.  Assert that the user is logged out and redirected to the home page.

### 2. `e2e/video.spec.ts`

*   **Submit a Video (for authenticated users):**
    1.  Log in as a user with "creator" role.
    2.  Navigate to the "Submit Video" page.
    3.  Fill in the YouTube URL.
    4.  Submit the form.
    5.  Assert that a confirmation message is shown and the user is redirected to the video page.

*   **View a Video:**
    1.  Navigate to a video details page (either by ID or by clicking a video on the home page).
    2.  Assert that the video title, description, and other details are visible.
    3.  Assert that the video player is present.

## Running the Tests

```bash
npx playwright test
```

This command will run all the tests in the `e2e/` directory.

To see the test report:
```bash
npx playwright show-report
``` 