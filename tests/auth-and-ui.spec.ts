import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Authentication Pages', () => {

  test('Login page loads correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    // Check page loaded
    await expect(page).toHaveTitle(/InstantGlobal/);

    // Check hero text
    await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();

    // Check form elements
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel(/Password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();

    // Check theme toggle
    await expect(page.locator('[class*="toggle-theme"]').first()).toBeVisible();

    // Check logo navigation
    const logo = page.locator('a[href="/"]').first();
    await expect(logo).toBeVisible();

    console.log('✓ Login page structure is correct');
  });

  test('Signup page loads correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);

    // Check page loaded
    await expect(page.getByRole('heading', { name: /Create your account/i })).toBeVisible();

    // Check form elements
    await expect(page.getByLabel(/Full Name/i)).toBeVisible();
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel(/Country/i)).toBeVisible();
    await expect(page.getByLabel(/Password/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Create Account/i })).toBeVisible();

    // Check theme toggle
    await expect(page.locator('[class*="toggle-theme"]').first()).toBeVisible();

    console.log('✓ Signup page structure is correct');
  });

  test('Test login form submission and API call', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    // Set up network interception
    let apiCallMade = false;
    let apiError = null;

    page.on('response', response => {
      if (response.url().includes('/api/auth/login') || response.url().includes('login')) {
        apiCallMade = true;
        console.log(`API Call: ${response.url()} - Status: ${response.status()}`);
      }
    });

    page.on('console', msg => {
      if (msg.type() === 'error') {
        apiError = msg.text();
        console.log('Console Error:', msg.text());
      }
    });

    // Fill form
    await page.getByLabel(/Email/i).fill('test@example.com');
    await page.getByLabel(/Password/i).fill('testpassword123');

    // Submit
    await page.getByRole('button', { name: /Sign In/i }).click();

    // Wait a bit for API call
    await page.waitForTimeout(2000);

    if (apiCallMade) {
      console.log('✓ API call was made');
    } else {
      console.log('⚠ No API call detected - server might not be running');
    }

    if (apiError) {
      console.log('⚠ Console error detected:', apiError);
    }

    // Check for alert/error message visibility
    const alert = page.locator('[role="alert"]');
    if (await alert.isVisible()) {
      const alertText = await alert.textContent();
      console.log('Alert shown:', alertText);

      // Check if alert is styled correctly
      const alertStyles = await alert.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          border: styles.border,
          backgroundColor: styles.backgroundColor,
          color: styles.color,
        };
      });
      console.log('Alert styles:', alertStyles);
    }
  });

  test('Test signup form submission', async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);

    let apiCallMade = false;

    page.on('response', response => {
      if (response.url().includes('/api/auth/register') || response.url().includes('register')) {
        apiCallMade = true;
        console.log(`API Call: ${response.url()} - Status: ${response.status()}`);
      }
    });

    // Fill form
    await page.getByLabel(/Full Name/i).fill('Test User');
    await page.getByLabel(/Email/i).fill('test@example.com');
    await page.getByLabel(/Country/i).fill('US');
    await page.getByLabel(/Password/i).first().fill('testpass123');
    await page.getByLabel(/Confirm/i).fill('testpass123');

    // Submit
    await page.getByRole('button', { name: /Create Account/i }).click();

    await page.waitForTimeout(2000);

    if (apiCallMade) {
      console.log('✓ API call was made');
    } else {
      console.log('⚠ No API call detected - server might not be running');
    }
  });
});

test.describe('Navigation and Routing', () => {

  test('Header navigation works', async ({ page }) => {
    await page.goto(BASE_URL);

    // Check Products dropdown
    await page.hover('button:has-text("Products")');
    await page.waitForTimeout(500);

    // Click on Global Accounts
    const globalAccountsLink = page.locator('a[href="/products/global-accounts"]').first();
    if (await globalAccountsLink.isVisible()) {
      await globalAccountsLink.click();
      await expect(page).toHaveURL(/global-accounts/);
      console.log('✓ Products dropdown navigation works');
    }
  });

  test('Signup/Register routing consistency', async ({ page }) => {
    // Test /signup route
    await page.goto(`${BASE_URL}/signup`);
    await expect(page.getByRole('heading', { name: /Create your account/i })).toBeVisible();
    console.log('✓ /signup route works');

    // Test /register route (should also work)
    await page.goto(`${BASE_URL}/register`);
    await expect(page.getByRole('heading', { name: /Create your account/i })).toBeVisible();
    console.log('✓ /register route works');
  });
});

test.describe('Visual and Styling Checks', () => {

  test('Dark mode is default', async ({ page }) => {
    await page.goto(BASE_URL);

    // Check if dark class is on html element
    const htmlClass = await page.locator('html').getAttribute('class');
    console.log('HTML classes:', htmlClass);

    // Check background color
    const bgColor = await page.locator('body').evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    console.log('Body background color:', bgColor);

    // Dark mode typically has dark background (rgb values < 50)
    if (bgColor.includes('rgb') && !bgColor.includes('255')) {
      console.log('✓ Dark mode is active by default');
    } else {
      console.log('⚠ Light mode might be default');
    }
  });

  test('Check About page structure', async ({ page }) => {
    await page.goto(`${BASE_URL}/about`);

    // Check for overkill hero
    await expect(page.locator('section').first()).toBeVisible();

    // Check for GlobalCoverageMap
    const hasMap = await page.getByText(/Operating worldwide/i).isVisible();
    if (hasMap) {
      console.log('✓ GlobalCoverageMap is present on About page');
    } else {
      console.log('⚠ GlobalCoverageMap might be missing');
    }

    // Check for combined CTAs
    const ctaSections = await page.locator('section').count();
    console.log(`About page has ${ctaSections} sections`);
  });

  test('Check Global Accounts page', async ({ page }) => {
    await page.goto(`${BASE_URL}/products/global-accounts`);

    // Check for GlobalCoverageMap
    const hasMap = await page.getByText(/Operating worldwide/i).isVisible();
    if (hasMap) {
      console.log('✓ GlobalCoverageMap is present on Global Accounts page');
    } else {
      console.log('⚠ GlobalCoverageMap might be missing');
    }
  });

  test('Scan all product pages for orange/gradient issues', async ({ page }) => {
    const productPages = [
      '/products/cards',
      '/products/payouts',
      '/products/fx-treasury',
      '/products/travel',
      '/products/api',
    ];

    for (const pagePath of productPages) {
      await page.goto(`${BASE_URL}${pagePath}`);
      await page.waitForLoadState('networkidle');

      // Check for decorative gradient blobs in hero section
      const heroSection = page.locator('section').first();
      const decorativeElements = await heroSection.locator('[class*="blur-3xl"]').count();

      if (decorativeElements > 0) {
        console.log(`⚠ ${pagePath}: Found ${decorativeElements} decorative blur elements (potential unwanted gradients)`);

        // Get background colors of these elements
        const colors = await heroSection.locator('[class*="blur-3xl"]').evaluateAll(elements => {
          return elements.map(el => window.getComputedStyle(el).backgroundColor);
        });
        console.log(`   Colors:`, colors);
      } else {
        console.log(`✓ ${pagePath}: No decorative gradient blobs found`);
      }
    }
  });

  test('Check shadow opacity in light mode', async ({ page }) => {
    await page.goto(BASE_URL);

    // Switch to light mode
    const themeToggle = page.locator('[class*="toggle"]').first();
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500);
    }

    // Check shadow on a card
    const card = page.locator('[class*="shadow-depth"]').first();
    if (await card.isVisible()) {
      const shadow = await card.evaluate(el => {
        return window.getComputedStyle(el).boxShadow;
      });
      console.log('Light mode shadow:', shadow);

      if (shadow !== 'none') {
        console.log('✓ Shadows are applied in light mode');
      }
    }
  });
});

test.describe('Server and API Status', () => {

  test('Check if API server is accessible', async ({ page }) => {
    const apiEndpoints = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/me',
    ];

    for (const endpoint of apiEndpoints) {
      try {
        const response = await page.request.post(`${BASE_URL}${endpoint}`, {
          data: { test: 'data' },
          timeout: 5000,
        });

        console.log(`${endpoint}: ${response.status()} ${response.statusText()}`);

        if (response.status() === 404) {
          console.log(`⚠ ${endpoint} not found - endpoint not implemented`);
        } else if (response.status() >= 500) {
          console.log(`⚠ ${endpoint} server error`);
        }
      } catch (error: any) {
        console.log(`⚠ ${endpoint}: ${error.message}`);
      }
    }
  });
});
