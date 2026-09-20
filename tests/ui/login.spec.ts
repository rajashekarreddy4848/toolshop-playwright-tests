import { test, expect } from './fixtures';
import { DEMO_USER } from '../../utils/testData';

test.describe('Login', () => {
  test.beforeEach(async ({ login }) => {
    await login.goto();
  });

  test('valid credentials open the account page', async ({ login, page }) => {
    await login.login(DEMO_USER.email, DEMO_USER.password);
    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByRole('heading', { name: 'My account' })).toBeVisible();
    await expect(login.navMenu).toContainText(DEMO_USER.displayName);
  });

  test('wrong password shows an error and stays on the login page', async ({ login, page }) => {
    await login.login(DEMO_USER.email, 'definitely-wrong');
    await expect(login.loginError).toHaveText('Invalid email or password');
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('unknown email shows the same generic error', async ({ login }) => {
    await login.login('nobody.here@example.com', 'whatever123');
    await expect(login.loginError).toHaveText('Invalid email or password');
  });

  test('empty form shows required-field errors', async ({ login }) => {
    await login.submit.click();
    await expect(login.emailError).toHaveText('Email is required');
    await expect(login.passwordError).toHaveText('Password is required');
  });

  test('malformed email is rejected by validation', async ({ login }) => {
    await login.email.fill('not-an-email');
    await login.password.fill('something');
    await login.submit.click();
    await expect(login.emailError).toBeVisible();
  });

  test('protected account page redirects anonymous users to login', async ({ page }) => {
    await page.goto('/account');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
