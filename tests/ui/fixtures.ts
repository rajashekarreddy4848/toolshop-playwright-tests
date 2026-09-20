import { test as base, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';
import { LoginPage } from '../../pages/LoginPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

type Pages = {
  home: HomePage;
  product: ProductPage;
  login: LoginPage;
  checkout: CheckoutPage;
};

export const test = base.extend<Pages>({
  home: async ({ page }, use) => use(new HomePage(page)),
  product: async ({ page }, use) => use(new ProductPage(page)),
  login: async ({ page }, use) => use(new LoginPage(page)),
  checkout: async ({ page }, use) => use(new CheckoutPage(page)),
});

export { expect };
