import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  const networkErrors = [];

  // Listen to console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    console.log(`[${type.toUpperCase()}] ${text}`);

    if (type === 'error') {
      errors.push(text);
    }
  });

  // Listen to page errors
  page.on('pageerror', error => {
    const errMsg = `${error.toString()}\n${error.stack}`;
    errors.push(errMsg);
    console.log(`[UNCAUGHT ERROR] ${errMsg}`);
  });

  // Listen to failed requests
  page.on('response', async response => {
    if (response.status() >= 400) {
      const url = response.url();
      const status = response.status();
      let body = '';
      try {
        body = await response.text();
      } catch(e) {}
      const log = `[${status}] ${url}\n  Response: ${body.substring(0, 200)}`;
      networkErrors.push(log);
      console.log(log);
    }
  });

  console.log('=== Step 1: Navigate to Login Page ===\n');
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(2000);

  console.log('\n=== Step 2: Attempt Registration First ===\n');

  // Try to register a new user
  await page.goto('http://localhost:3000/register');
  await page.waitForTimeout(2000);

  const email = `test${Date.now()}@example.com`;
  const password = 'TestPassword123!';

  console.log(`Filling registration form with email: ${email}`);

  try {
    // Fill registration form
    await page.fill('input[type="email"]', email);
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');

    const passwordFields = await page.locator('input[type="password"]').all();
    if (passwordFields.length >= 2) {
      await passwordFields[0].fill(password);
      await passwordFields[1].fill(password);
    } else {
      await page.fill('input[type="password"]', password);
    }

    console.log('Submitting registration...');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    const currentUrl = page.url();
    console.log(`After registration, URL: ${currentUrl}`);

    // If redirected to dashboard, we're logged in
    if (currentUrl.includes('/dashboard')) {
      console.log('\n✓ Successfully registered and logged in!');
      console.log('\n=== Step 3: Testing Dashboard ===\n');
      await page.waitForTimeout(3000);

      // Take screenshot
      await page.screenshot({ path: 'dashboard-authenticated.png', fullPage: true });
      console.log('Screenshot saved to dashboard-authenticated.png');

      // Try navigating to different dashboard pages
      const pages = ['/dashboard/accounts', '/dashboard/cards', '/dashboard/crypto'];

      for (const path of pages) {
        console.log(`\nNavigating to ${path}...`);
        await page.goto(`http://localhost:3000${path}`);
        await page.waitForTimeout(2000);
      }

    } else if (currentUrl.includes('/login')) {
      console.log('\n=== Step 3: Logging In ===\n');
      await page.fill('input[type="email"]', email);
      await page.fill('input[type="password"]', password);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);
      console.log(`After login, URL: ${page.url()}`);
    }

  } catch (error) {
    console.error('\n❌ Form interaction failed:', error.message);
  }

  console.log('\n\n=== SUMMARY ===');
  console.log(`Total Console Errors: ${errors.length}`);
  console.log(`Total Network Errors: ${networkErrors.length}`);

  if (errors.length > 0) {
    console.log('\n=== CONSOLE ERRORS ===');
    errors.forEach((err, i) => console.log(`${i + 1}. ${err}\n`));
  }

  if (networkErrors.length > 0) {
    console.log('\n=== NETWORK ERRORS ===');
    networkErrors.forEach((err, i) => console.log(`${i + 1}. ${err}\n`));
  }

  console.log('\nKeeping browser open for 5 seconds...');
  await page.waitForTimeout(5000);
  await browser.close();
})();
