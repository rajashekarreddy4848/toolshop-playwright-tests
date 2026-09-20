import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly rows: Locator;
  readonly total: Locator;
  readonly proceedToSignIn: Locator;
  readonly proceedToBilling: Locator;
  readonly proceedToPayment: Locator;
  readonly paymentMethod: Locator;
  readonly finish: Locator;
  readonly emptyCartMessage: Locator;
  readonly country: Locator;
  readonly postalCode: Locator;
  readonly houseNumber: Locator;
  readonly street: Locator;
  readonly city: Locator;
  readonly state: Locator;

  constructor(private readonly page: Page) {
    this.rows = page.locator('table tbody tr');
    this.total = page.getByTestId('cart-total');
    this.proceedToSignIn = page.getByTestId('proceed-1');
    this.proceedToBilling = page.getByTestId('proceed-2');
    this.proceedToPayment = page.getByTestId('proceed-3');
    this.paymentMethod = page.getByTestId('payment-method');
    this.finish = page.getByTestId('finish');
    this.emptyCartMessage = page.getByText('The cart is empty');
    this.country = page.getByTestId('country');
    this.postalCode = page.getByTestId('postal_code');
    this.houseNumber = page.getByTestId('house_number');
    this.street = page.getByTestId('street');
    this.city = page.getByTestId('city');
    this.state = page.getByTestId('state');
  }

  async open() {
    await this.page.getByTestId('nav-cart').click();
    await this.page.waitForURL(/\/checkout/);
  }

  async fillBillingAddress(a: {
    country: string;
    postalCode: string;
    houseNumber: string;
    street: string;
    city: string;
    state: string;
  }) {
    await this.country.selectOption({ label: a.country });
    await this.postalCode.fill(a.postalCode);
    await this.houseNumber.fill(a.houseNumber);
    await this.street.fill(a.street);
    await this.city.fill(a.city);
    await this.state.fill(a.state);
  }

  itemRow(name: string): Locator {
    return this.rows.filter({ hasText: name });
  }

  quantityInput(name: string): Locator {
    return this.itemRow(name).getByTestId('product-quantity');
  }

  removeButton(name: string): Locator {
    return this.itemRow(name).locator('a.btn-danger, .btn-danger');
  }
}
