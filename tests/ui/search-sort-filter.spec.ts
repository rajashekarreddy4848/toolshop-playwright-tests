import { test, expect } from './fixtures';

test.describe('Search, sort and filter', () => {
  test.beforeEach(async ({ home }) => {
    await home.goto();
  });

  test('search returns products matching the term', async ({ home }) => {
    const response = await home.search('hammer');
    const body = await response.json();
    expect(body.data.length).toBeGreaterThan(0);
    // What the UI shows must match what the API returned
    expect(await home.productNames()).toEqual(body.data.map((p: { name: string }) => p.name));
    for (const name of await home.productNames()) {
      expect(name.toLowerCase()).toContain('hammer');
    }
  });

  test('search with no matches shows an empty-state message', async ({ home }) => {
    await home.search('zzzzqqqq');
    await expect(home.noResults).toHaveText('There are no products found.');
    await expect(home.cards).toHaveCount(0);
  });

  test('reset button clears the search and restores the list', async ({ home }) => {
    await home.search('zzzzqqqq');
    await expect(home.cards).toHaveCount(0);
    const done = home.waitForProducts();
    await home.searchReset.click();
    await done;
    await expect(home.cards).toHaveCount(9);
  });

  test('sort by name A-Z orders names ascending', async ({ home }) => {
    await home.sortBy('Name (A - Z)');
    const names = await home.productNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('sort by name Z-A orders names descending', async ({ home }) => {
    await home.sortBy('Name (Z - A)');
    const names = await home.productNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('sort by price low to high orders prices ascending', async ({ home }) => {
    await home.sortBy('Price (Low - High)');
    const prices = await home.productPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort by price high to low orders prices descending', async ({ home }) => {
    await home.sortBy('Price (High - Low)');
    const prices = await home.productPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('category filter narrows results to that category', async ({ home }) => {
    const total = (await home.productNames()).length;
    const response = await home.filterByCategory('Hammer');
    const body = await response.json();
    expect(body.data.length).toBeGreaterThan(0);
    expect(await home.productNames()).toEqual(body.data.map((p: { name: string }) => p.name));
    expect(body.total).toBeLessThan(50); // far fewer than the full catalogue
    expect(total).toBe(9);
  });
});
