import { Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly name: Locator;
  readonly price: Locator;
  readonly addToCart: Locator;
  readonly increase: Locator;
  readonly quantity: Locator;
  readonly cartBadge: Locator;
  readonly toast: Locator;

  constructor(private readonly page: Page) {
    this.name = page.getByTestId('product-name');
    this.price = page.getByTestId('unit-price');
    this.addToCart = page.getByTestId('add-to-cart');
    this.increase = page.getByTestId('increase-quantity');
    this.quantity = page.getByTestId('quantity');
    this.cartBadge = page.getByTestId('cart-quantity');
    this.toast = page.getByRole('alert');
  }

  async add(times = 1) {
    for (let i = 1; i < times; i++) await this.increase.click();
    await this.addToCart.click();
  }
}
