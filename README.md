# Playwright + TypeScript Test Automation Framework

![Playwright Tests](https://github.com/Ravishbond/playwright-saucedemo-framework/actions/workflows/playwright.yml/badge.svg)

End-to-end UI and API test automation framework for [Sauce Demo](https://www.saucedemo.com) and [Restful Booker API](https://restful-booker.herokuapp.com), built with Playwright and TypeScript.

## Features

- **Page Object Model** with custom Playwright fixtures (no setup code in tests)
- **Login once, reuse everywhere** via a setup project and `storageState`
- **Data-driven tests** from JSON (positive and negative checkout scenarios)
- **API testing**: full CRUD lifecycle, token auth, status-code and negative tests
- **Network mocking**: fake, modified and failing API responses
- **Visual regression** with `toHaveScreenshot` baselines (Chromium)
- **Accessibility checks** with axe-core against WCAG 2.2 A/AA
- **AI-assisted tests** generated with Playwright Test Agents (planner, generator, healer) and reviewed by a human before merging
- **Known-bug tracking** with `test.fail` (alerts automatically when a bug is fixed)
- **Tags** for smoke vs full regression
- **Cross-browser**: Chromium, Firefox, WebKit
- **Code quality**: ESLint (with `eslint-plugin-playwright`), TypeScript type check and Prettier, all enforced in CI
- **Reporting**: Playwright HTML report + Allure, with screenshot, video and trace on failure

![Allure report](docs/allure-report.png)

## Tech stack

Playwright · TypeScript · Node.js · dotenv · Allure · axe-core · ESLint · Prettier · GitHub Actions

## Project structure

```
pages/           Page objects (locators + actions, no assertions)
fixtures/        Custom fixtures that provide ready page objects and states
tests/           UI, visual, accessibility and mocking tests, plus auth setup
tests/api/       API tests (Restful Booker)
tests/seed.spec.ts  Seed test used by the Playwright Test Agents (excluded from normal runs)
specs/           Test plans produced by the planner agent
test-data/       JSON test data
utils/           Environment helper (fails fast on missing variables)
.claude/agents/  Playwright Test Agent definitions (planner, generator, healer)
.github/         CI workflow (lint, format check, type check, tests)
```

## Getting started

```bash
git clone https://github.com/Ravishbond/playwright-saucedemo-framework.git
cd playwright-saucedemo-framework
npm install
npx playwright install
cp .env.example .env    # then fill in the values
```

## Running tests

| Command                 | What it runs                        |
| ----------------------- | ----------------------------------- |
| `npm test`              | Full suite, all browsers            |
| `npm run test:smoke`    | Smoke tests only (`@smoke`)         |
| `npm run test:api`      | API tests only                      |
| `npm run test:ui`       | Playwright UI mode                  |
| `npm run report:allure` | Generate and open the Allure report |

## Code quality

| Command                | What it does                          |
| ---------------------- | ------------------------------------- |
| `npm run lint`         | Run ESLint                            |
| `npm run typecheck`    | Type-check with `tsc --noEmit`        |
| `npm run format`       | Format all files with Prettier        |
| `npm run format:check` | Verify formatting without changing it |

## Bugs found during testing

| ID      | Area        | Finding                                                                                                                       |
| ------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| BUG-101 | Booking API | Accepts a negative `totalprice` (expected 400)                                                                                |
| BUG-102 | Web UI      | Shows infinite "Loading..." when the API returns 500, with no error or retry                                                  |
| BUG-103 | Web UI      | For `visual_user`, the inventory page layout differs from the visual baseline                                                 |
| BUG-104 | Web UI      | For `problem_user`, the sort dropdown ignores the selection, snaps back to Name (A to Z), and the product order never changes |
| Note    | Booking API | DELETE returns 201 instead of 200/204; unauthenticated delete returns 403 instead of 401                                      |

## Author

**Ravish**, Automation Architect (web, mobile and API test automation)
