import { Page, Locator, Response } from '@playwright/test';
import { parsePrice } from '../utils/testData';

export class HomePage {
  readonly cards: Locator;
  readonly searchInput: Locator;
  readonly searchSubmit: Locator;
  readonly searchReset: Locator;
  readonly noResults: Locator;
  readonly sortSelect: Locator;
  readonly nextPage: Locator;
  readonly pagination: Locator;

  constructor(private readonly page: Page) {
    this.cards = page.locator('a.card');
    this.searchInput = page.getByTestId('search-query');
    this.searchSubmit = page.getByTestId('search-submit');
    this.searchReset = page.getByTestId('search-reset');
    this.noResults = page.getByTestId('no-results');
    this.sortSelect = page.getByTestId('sort');
    this.nextPage = page.getByTestId('pagination-next');
    this.pagination = page.locator('.pagination');
  }

  async goto() {
    const first = this.waitForProducts();
    await this.page.goto('/');
    await first;
    await this.cards.first().waitFor();
  }

  /**
   * Resolves when the next product-list API call finishes.
   * The site loads its list with the HTTP QUERY method (older builds used GET), so accept both.
   */
  waitForProducts(): Promise<Response> {
    return this.page.waitForResponse(
      (r) =>
        /\/products(\/search)?(\?|$)/.test(r.url()) &&
        ['QUERY', 'GET'].includes(r.request().method()) &&
        r.ok(),
    );
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    const done = this.waitForProducts();
    await this.searchSubmit.click();
    return done;
  }

  async sortBy(label: string) {
    const done = this.waitForProducts();
    await this.sortSelect.selectOption({ label });
    await done;
  }

  async filterByCategory(name: string) {
    const done = this.waitForProducts();
    await this.page.getByRole('checkbox', { name, exact: true }).check();
    return done;
  }

  async productNames(): Promise<string[]> {
    const names = await this.cards.getByTestId('product-name').allInnerTexts();
    return names.map((n) => n.trim());
  }

  async productPrices(): Promise<number[]> {
    const prices = await this.cards.getByTestId('product-price').allInnerTexts();
    return prices.map(parsePrice);
  }

  /** Opens the first in-stock product and returns its name. */
  async openFirstInStockProduct(): Promise<string> {
    const card = this.cards.filter({ hasNotText: 'Out of stock' }).first();
    const name = (await card.getByTestId('product-name').innerText()).trim();
    await card.click();
    await this.page.waitForURL(/\/product\//);
    return name;
  }
}
