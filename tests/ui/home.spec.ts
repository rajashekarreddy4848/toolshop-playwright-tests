import { test, expect } from './fixtures';

test.describe('Home page', () => {
  test.beforeEach(async ({ home }) => {
    await home.goto();
  });

  test('has the expected title', async ({ page }) => {
    await expect(page).toHaveTitle(/Practice Software Testing - Toolshop/);
  });

  test('lists 9 products per page with a name and price each', async ({ home }) => {
    await expect(home.cards).toHaveCount(9);
    for (const price of await home.productPrices()) {
      expect(price).toBeGreaterThan(0);
    }
    for (const name of await home.productNames()) {
      expect(name.length).toBeGreaterThan(0);
    }
  });

  test('main navigation links are visible', async ({ page }) => {
    for (const id of ['nav-home', 'nav-categories', 'nav-contact', 'nav-sign-in']) {
      await expect(page.getByTestId(id)).toBeVisible();
    }
  });

  test('pagination moves to page 2 and shows different products', async ({ home, page }) => {
    const firstPage = await home.productNames();
    const done = home.waitForProducts();
    await page.locator('.pagination').getByText('2', { exact: true }).click();
    await done;
    await expect.poll(async () => (await home.productNames())[0]).not.toBe(firstPage[0]);
  });

  test('Contact link opens the contact form', async ({ page }) => {
    await page.getByTestId('nav-contact').click();
    await expect(page).toHaveURL(/\/contact/);
  });
});
