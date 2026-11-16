# Inventory Page Sorting Test Plan

## Application Overview

Sauce Demo (https://www.saucedemo.com/inventory.html) product sort dropdown ([data-test="product-sort-container"]). Options (value: label): az: Name (A to Z); za: Name (Z to A); lohi: Price (low to high); hilo: Price (high to low). 6 products. Observed with standard_user: default is az; sort does NOT persist across navigation to a product page and back, or reload (resets to az). All scenarios start logged in as standard_user (storage state from auth.setup.ts) on /inventory.html in a fresh state. Reference data: Backpack $29.99, Bike Light $9.99, Bolt T-Shirt $15.99, Fleece Jacket $49.99, Onesie $7.99, Test.allTheThings() T-Shirt (Red) $15.99.

## Test Scenarios

### 1. Inventory Sorting

**Seed:** `tests/seed.spec.ts`

#### 1.1. Dropdown lists exactly 4 options with correct labels and values

**File:** `tests/sorting/options.spec.ts`

**Steps:**
  1. Open /inventory.html and read all options of the sort dropdown
    - expect: Exactly 4 options in order: az 'Name (A to Z)', za 'Name (Z to A)', lohi 'Price (low to high)', hilo 'Price (high to low)'

#### 1.2. Default sort on load is Name (A to Z)

**File:** `tests/sorting/default.spec.ts`

**Steps:**
  1. Open /inventory.html without touching the dropdown
    - expect: Dropdown value is 'az' and visible active label is 'Name (A to Z)'
    - expect: Names in order: Sauce Labs Backpack, Sauce Labs Bike Light, Sauce Labs Bolt T-Shirt, Sauce Labs Fleece Jacket, Sauce Labs Onesie, Test.allTheThings() T-Shirt (Red)
    - expect: Prices in order: $29.99, $9.99, $15.99, $49.99, $7.99, $15.99
    - expect: 6 items displayed

#### 1.3. Sort by Name (A to Z)

**File:** `tests/sorting/name-az.spec.ts`

**Steps:**
  1. Select 'Name (A to Z)' (after switching away to another option first, so the change is real)
    - expect: Names ascending alphabetically (same order as default list); each name paired with its correct price
    - expect: Dropdown shows 'Name (A to Z)'

#### 1.4. Sort by Name (Z to A)

**File:** `tests/sorting/name-za.spec.ts`

**Steps:**
  1. Select 'Name (Z to A)'
    - expect: Names: Test.allTheThings() T-Shirt (Red), Sauce Labs Onesie, Sauce Labs Fleece Jacket, Sauce Labs Bolt T-Shirt, Sauce Labs Bike Light, Sauce Labs Backpack
    - expect: Prices: $15.99, $7.99, $49.99, $15.99, $9.99, $29.99
    - expect: Dropdown shows 'Name (Z to A)'

#### 1.5. Sort by Price (low to high)

**File:** `tests/sorting/price-lohi.spec.ts`

**Steps:**
  1. Select 'Price (low to high)'
    - expect: Prices numerically ascending: $7.99, $9.99, $15.99, $15.99, $29.99, $49.99 (numeric not string compare; $7.99 before $15.99)
    - expect: Names: Onesie, Bike Light, Bolt T-Shirt, Test.allTheThings() T-Shirt (Red), Backpack, Fleece Jacket
    - expect: Dropdown shows 'Price (low to high)'

#### 1.6. Sort by Price (high to low)

**File:** `tests/sorting/price-hilo.spec.ts`

**Steps:**
  1. Select 'Price (high to low)'
    - expect: Prices: $49.99, $29.99, $15.99, $15.99, $9.99, $7.99
    - expect: Names: Fleece Jacket, Backpack, Bolt T-Shirt, Test.allTheThings() T-Shirt (Red), Bike Light, Onesie
    - expect: Dropdown shows 'Price (high to low)'

#### 1.7. Equal-price items keep stable relative order

**File:** `tests/sorting/ties.spec.ts`

**Steps:**
  1. Select price low to high, then high to low
    - expect: In both, Bolt T-Shirt ($15.99) appears before Test.allTheThings() T-Shirt (Red) ($15.99) (observed stable ordering)
    - expect: Both $15.99 items are adjacent

#### 1.8. Switching between all options repeatedly

**File:** `tests/sorting/switching.spec.ts`

**Steps:**
  1. Cycle az -> za -> lohi -> hilo -> az -> hilo -> za
    - expect: After each change the order matches that option's expected order
    - expect: Always 6 items, no duplicates or missing products
    - expect: Dropdown value always matches last choice

#### 1.9. Product/price pairing preserved after sort

**File:** `tests/sorting/pairing.spec.ts`

**Steps:**
  1. For each of the 4 options, read each item's name, price, and image
    - expect: Each name still has its original price, description and image (e.g. Onesie $7.99, Fleece Jacket $49.99)

#### 1.10. Sort and cart interaction

**File:** `tests/sorting/cart.spec.ts`

**Steps:**
  1. Add Sauce Labs Backpack to cart, then sort by Price (high to low)
    - expect: Backpack still shows 'Remove' button, cart badge remains 1
    - expect: Adding another item after sorting increments badge to 2 and adds the correct item

#### 1.11. Sort state after opening a product and returning (Back button)

**File:** `tests/sorting/navigate-back.spec.ts`

**Steps:**
  1. Select Price (high to low), click first product name (Fleece Jacket), then use browser Back
    - expect: Detail URL is /inventory-item.html?id=...
    - expect: Observed behavior: list resets to Name (A to Z) and dropdown shows 'az' (sort NOT persisted). Test should document this current behavior; flag as potential defect/UX issue if persistence is expected

#### 1.12. Sort state after 'Back to products' button

**File:** `tests/sorting/navigate-back-button.spec.ts`

**Steps:**
  1. Select Name (Z to A), open a product, click 'Back to products'
    - expect: Inventory loads; verify dropdown and order (expected to reset to A to Z, matching Back-button behavior)

#### 1.13. Sort state after page reload

**File:** `tests/sorting/reload.spec.ts`

**Steps:**
  1. Select Price (low to high), reload the page
    - expect: Observed: dropdown resets to 'az' and products show A to Z order; no stale mismatch between dropdown and list

#### 1.14. Dropdown selected value and active label reflect choice

**File:** `tests/sorting/selected-value.spec.ts`

**Steps:**
  1. For each option select it and read the select value and the .active_option text
    - expect: Value equals option value and active label text equals option label every time

#### 1.15. Keyboard operation of dropdown

**File:** `tests/sorting/keyboard.spec.ts`

**Steps:**
  1. Focus the dropdown and use ArrowDown / ArrowUp to change option
    - expect: List re-sorts to match the newly highlighted option; no console errors beyond baseline

#### 1.16. Sort works for other user types (negative/regression)

**File:** `tests/sorting/other-users.spec.ts`

**Steps:**
  1. Log in as problem_user and visual_user (fresh contexts) and repeat Price and Name sorts
    - expect: Order matches expected for each option; any deviation (known app quirks for these users) is recorded as a defect, not silently accepted

#### 1.17. Direct access to inventory unauthenticated

**File:** `tests/sorting/unauth.spec.ts`

**Steps:**
  1. In a fresh context with no session, open /inventory.html
    - expect: Redirected to login with error 'You can only access /inventory.html when you are logged in'; no sort dropdown visible
