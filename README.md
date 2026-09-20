# Toolshop Test Automation (Playwright + TypeScript)

End-to-end **UI** test automation for [Practice Software Testing – Toolshop](https://practicesoftwaretesting.com/),
a public demo web shop built for test-automation practice.

- **25 automated UI tests**, all passing, about 15 seconds locally
- Page Object Model + custom Playwright fixtures
- Screenshots on failure, traces on retry, HTML report

## What is covered

| Area | Tests |
|---|---|
| Home page | title, 9 products per page, nav links, pagination, contact link |
| Search / sort / filter | search results, empty state, reset, sort by name and price (both directions), category filter. UI results are compared with the API response |
| Login | valid login, wrong password, unknown email, empty form, malformed email, protected page redirect |
| Cart | add to cart + badge, price in cart, quantity carried over, remove item |
| Checkout | full order as the demo user (billing address, cash on delivery), anonymous user asked to sign in |

## Setup

Requires Node.js 18+.

```bash
npm install
npx playwright install chromium
```

## Run

```bash
npm test               # run all tests (headless)
npm run test:headed    # run in a visible browser
npx playwright test --ui   # interactive debug mode
npm run report         # open the last HTML report
```

## Project structure

```
pages/        Page Objects (HomePage, ProductPage, LoginPage, CheckoutPage)
tests/ui/     UI specs + fixtures that inject the page objects
utils/        Test data and helpers
```

## Design notes

- **Locators:** the site exposes `data-test` attributes, so `testIdAttribute` is set to `data-test` and `getByTestId` is used, with role-based locators where possible.
- **No fixed sleeps:** tests wait on real signals (network responses, URLs, web-first assertions).
- **Interesting finding:** the product list is loaded with the HTTP **`QUERY`** method, not `GET`. Waiting only for `GET` responses makes list tests hang, so `HomePage.waitForProducts()` accepts both.
- **Test data:** uses the demo account the Toolshop project publishes for public use. Override with the `TOOLSHOP_EMAIL` and `TOOLSHOP_PASSWORD` environment variables.
- The checkout test places a real order on the shared demo site, which is what the site is designed for. Please keep runs reasonable.

## Continuous Integration (Jenkins)

The repo includes a declarative [`Jenkinsfile`](Jenkinsfile) with these stages:
checkout, `npm ci`, install Chromium, type check, run the Playwright suite.

- **Trigger:** polls GitHub every ~5 minutes and builds when there is a new commit
- **Results:** JUnit report (pass/fail trend in Jenkins) and the Playwright HTML report archived as a build artifact
- **CI mode:** `CI=true` enables 2 retries per failing test and runs headless

To run it yourself: install Jenkins, create a *Pipeline* job with *Pipeline script from SCM*, point it at this repo and set the script path to `Jenkinsfile`.

## Tech

Playwright Test, TypeScript, Node.js
