import { test, expect } from './fixtures';
import { parsePrice } from '../../utils/testData';

test.describe('Cart', () => {
  test.beforeEach(async ({ home }) => {
    await home.goto();
  });

  test('adding a product shows a confirmation and updates the cart badge', async ({ home, product }) => {
    await home.openFirstInStockProduct();
    await product.add();
    await expect(product.toast).toContainText('Product added to shopping cart');
    await expect(product.cartBadge).toHaveText('1');
  });

  test('cart page lists the added product with the right price', async ({ home, product, checkout }) => {
    const name = await home.openFirstInStockProduct();
    const unit = parsePrice(await product.price.innerText());
    await product.add();
    await expect(product.cartBadge).toHaveText('1');
    await checkout.open();
    await expect(checkout.rows).toHaveCount(1);
    await expect(checkout.itemRow(name)).toContainText(unit.toFixed(2));
    expect(parsePrice(await checkout.total.innerText())).toBeCloseTo(unit, 2);
  });

  test('quantity chosen on the product page is carried into the cart', async ({ home, product, checkout }) => {
    const name = await home.openFirstInStockProduct();
    const unit = parsePrice(await product.price.innerText());
    await product.add(3);
    await expect(product.cartBadge).toHaveText('3');
    await checkout.open();
    await expect(checkout.quantityInput(name)).toHaveValue('3');
    expect(parsePrice(await checkout.total.innerText())).toBeCloseTo(unit * 3, 2);
  });

  test('removing the only item empties the cart', async ({ home, product, checkout }) => {
    const name = await home.openFirstInStockProduct();
    await product.add();
    await checkout.open();
    await checkout.removeButton(name).click();
    await expect(checkout.emptyCartMessage).toBeVisible();
  });
});
