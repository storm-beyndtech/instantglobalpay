import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  const warnings = [];

  // Listen to console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();

    if (type === 'error') {
      errors.push(text);
      console.log(`[ERROR] ${text}`);
    } else if (type === 'warning') {
      warnings.push(text);
      console.log(`[WARN] ${text}`);
    }
  });

  // Listen to page errors
  page.on('pageerror', error => {
    errors.push(error.toString());
    console.log(`[PAGE ERROR] ${error.toString()}`);
  });

  console.log('Testing homepage...');
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(3000);

  console.log('\nTesting login page...');
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(3000);

  console.log('\nTesting dashboard (unauthenticated)...');
  await page.goto('http://localhost:3000/dashboard');
  await page.waitForTimeout(5000);

  console.log('\n\n=== SUMMARY ===');
  console.log(`Total Errors: ${errors.length}`);
  console.log(`Total Warnings: ${warnings.length}`);

  if (errors.length > 0) {
    console.log('\n=== UNIQUE ERRORS ===');
    const uniqueErrors = [...new Set(errors)];
    uniqueErrors.forEach((err, i) => console.log(`${i + 1}. ${err}`));
  }

  await browser.close();
})();
