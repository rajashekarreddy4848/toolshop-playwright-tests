// Demo account published by the Practice Software Testing project for public use.
// Override with env vars if you ever point these tests at your own deployment.
export const DEMO_USER = {
  email: process.env.TOOLSHOP_EMAIL ?? 'customer@practicesoftwaretesting.com',
  password: process.env.TOOLSHOP_PASSWORD ?? 'welcome01',
  displayName: 'Jane Doe',
};

export const parsePrice = (text: string): number => parseFloat(text.replace(/[^0-9.]/g, ''));

export const BILLING_ADDRESS = {
  country: 'India',
  postalCode: '500001',
  houseNumber: '12',
  street: 'Main Street',
  city: 'Hyderabad',
  state: 'Telangana',
};
