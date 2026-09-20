import { test, expect } from './fixtures';
import { BILLING_ADDRESS, DEMO_USER } from '../../utils/testData';

test.describe('Checkout (logged-in demo user)', () => {
  test('completes a cash-on-delivery order end to end', async ({ home, product, checkout, login, page }) => {
    await login.goto();
    await login.login(DEMO_USER.email, DEMO_USER.password);
    await expect(page).toHaveURL(/\/account/);

    await home.goto();
    await home.openFirstInStockProduct();
    await product.add();
    await checkout.open();

    await checkout.proceedToSignIn.click();       // step 1 -> already signed in
    await checkout.proceedToBilling.click();      // step 2 -> billing address
    await checkout.fillBillingAddress(BILLING_ADDRESS);
    await expect(checkout.proceedToPayment).toBeEnabled();
    await checkout.proceedToPayment.click();      // step 3 -> payment
    await checkout.paymentMethod.selectOption('cash-on-delivery');
    await checkout.finish.click();

    await expect(page.getByTestId('payment-success-message')).toContainText('Payment was successful');
  });

  test('anonymous user is asked to sign in at checkout', async ({ home, product, checkout, page }) => {
    await home.goto();
    await home.openFirstInStockProduct();
    await product.add();
    await checkout.open();
    await checkout.proceedToSignIn.click();
    await expect(page.getByTestId('login-form').or(page.getByTestId('email'))).toBeVisible();
  });
});
