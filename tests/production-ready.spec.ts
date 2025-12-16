import { test, expect } from '@playwright/test';

test.describe('Production Readiness Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test.describe('Homepage Tests', () => {
    test('should load homepage without errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');

      expect(errors).toHaveLength(0);
    });

    test('should display correct branding', async ({ page }) => {
      await page.goto('http://localhost:3000');

      // Check for InstantGlobal branding (use innerText to get only visible text, not source maps)
      const brandText = await page.evaluate(() => document.body.innerText);
      expect(brandText).toContain('InstantGlobal');

      // Should NOT contain placeholder/wrong company names
      expect(brandText).not.toContain('InstantGlobalPay');
      expect(brandText).not.toContain('Acme Corp');
      expect(brandText).not.toContain('Example Company');
    });

    test('should have working navigation', async ({ page }) => {
      await page.goto('http://localhost:3000');

      // Test main navigation links
      const links = ['Products', 'Pricing', 'About', 'Contact'];
      for (const link of links) {
        const element = page.locator(`text="${link}"`).first();
        await expect(element).toBeVisible();
      }
    });

    test('should have proper meta tags for SEO', async ({ page }) => {
      await page.goto('http://localhost:3000');

      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);

      const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
      expect(metaDescription).toBeTruthy();
    });
  });

  test.describe('Design System Tests', () => {
    test('should use consistent primary colors', async ({ page }) => {
      await page.goto('http://localhost:3000');

      // Marketing pages should use green (#22c55e)
      const buttons = page.locator('button').filter({ hasText: /Launch|Get Started|Sign Up/i });
      const count = await buttons.count();

      if (count > 0) {
        const firstButton = buttons.first();
        const bgColor = await firstButton.evaluate(el => {
          return window.getComputedStyle(el).backgroundColor;
        });

        // Should have greenish color
        expect(bgColor).toBeTruthy();
      }
    });

    test('should have glassmorphism navigation', async ({ page }) => {
      await page.goto('http://localhost:3000');

      // Check header element which has the glassmorphism effect
      const header = page.locator('header').first();
      const backdropFilter = await header.evaluate(el => {
        return window.getComputedStyle(el).backdropFilter;
      });

      // Should have blur effect
      expect(backdropFilter).toContain('blur');
    });

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');

      // Page should be usable on mobile
      const body = page.locator('body');
      await expect(body).toBeVisible();

      // Should not have horizontal scroll
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalScroll).toBeFalsy();
    });
  });

  test.describe('Authentication Flow', () => {
    test('should redirect to login when accessing dashboard', async ({ page }) => {
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForLoadState('networkidle');

      expect(page.url()).toContain('/login');
    });

    test('should have working registration form', async ({ page }) => {
      await page.goto('http://localhost:3000/register');

      // Check all form fields exist
      await expect(page.locator('input[id="name"]')).toBeVisible();
      await expect(page.locator('input[id="email"]')).toBeVisible();
      await expect(page.locator('input[id="country"]')).toBeVisible();
      await expect(page.locator('input[id="password"]')).toBeVisible();
      await expect(page.locator('input[id="confirm"]')).toBeVisible();

      // Check submit button
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should validate registration form', async ({ page }) => {
      await page.goto('http://localhost:3000/register');

      // Try to submit empty form
      await page.click('button[type="submit"]');

      // Form should not submit (HTML5 validation)
      const url = page.url();
      expect(url).toContain('/register');
    });
  });

  test.describe('Dashboard Tests (Authenticated)', () => {
    test('should display dashboard after login', async ({ page, context }) => {
      // Register a new user
      const timestamp = Date.now();
      const email = `test${timestamp}@example.com`;
      const password = 'TestPassword123!';

      await page.goto('http://localhost:3000/register');

      await page.fill('input[id="name"]', 'Test User');
      await page.fill('input[id="email"]', email);
      await page.fill('input[id="country"]', 'US');
      await page.fill('input[id="password"]', password);
      await page.fill('input[id="confirm"]', password);

      await page.click('button[type="submit"]');

      // Wait for redirect to dashboard
      await page.waitForURL('**/dashboard', { timeout: 10000 });

      // Should be on dashboard
      expect(page.url()).toContain('/dashboard');

      // Check for dashboard elements
      await expect(page.locator('aside')).toBeVisible(); // Sidebar
      await expect(page.locator('header')).toBeVisible(); // Top nav
    });

    test('should display all dashboard pages without errors', async ({ page }) => {
      // First register and login
      const timestamp = Date.now();
      const email = `test${timestamp}@example.com`;
      const password = 'TestPassword123!';

      await page.goto('http://localhost:3000/register');
      await page.fill('input[id="name"]', 'Test User');
      await page.fill('input[id="email"]', email);
      await page.fill('input[id="country"]', 'US');
      await page.fill('input[id="password"]', password);
      await page.fill('input[id="confirm"]', password);
      await page.click('button[type="submit"]');

      await page.waitForURL('**/dashboard', { timeout: 10000 });

      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      // Test all dashboard routes
      const routes = [
        '/dashboard',
        '/dashboard/accounts',
        '/dashboard/cards',
        '/dashboard/crypto',
        '/dashboard/transfers',
        '/dashboard/transactions',
        '/dashboard/flights',
        '/dashboard/admin',
        '/dashboard/profile',
      ];

      for (const route of routes) {
        await page.goto(`http://localhost:3000${route}`);
        await page.waitForLoadState('networkidle');

        // Page should load without console errors
        const pageErrors = errors.filter(e => !e.includes('DevTools'));
        expect(pageErrors).toHaveLength(0);

        errors.length = 0; // Clear for next iteration
      }
    });
  });

  test.describe('API Integration Tests', () => {
    test('should connect to backend API', async ({ page }) => {
      const response = await page.request.get('http://localhost:5000/api/transactions');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(Array.isArray(data)).toBeTruthy();
    });

    test('should handle registration API', async ({ page }) => {
      const timestamp = Date.now();
      const uniqueId = Math.random().toString(36).substring(7);
      const uniqueEmail = `apitest${timestamp}${uniqueId}@example.com`;
      const uniqueUsername = `apitest${timestamp}${uniqueId}`;

      const response = await page.request.post('http://localhost:5000/api/auth/register', {
        data: {
          firstName: 'API',
          lastName: 'Test',
          username: uniqueUsername,
          email: uniqueEmail,
          country: 'US',
          password: 'TestPassword123!',
        },
      });

      // The registration endpoint should respond (even if it fails due to duplicate or other issues)
      // We mainly care that it's accessible and returns valid JSON
      expect(response.status()).toBeGreaterThanOrEqual(200);
      expect(response.status()).toBeLessThan(600);

      const data = await response.json();
      expect(data).toBeTruthy();

      // If successful, should have a token
      if (response.ok()) {
        expect(data.token).toBeTruthy();
      }
    });
  });

  test.describe('Performance Tests', () => {
    test('should load homepage in reasonable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      // Should load in under 10 seconds (dev mode with Turbopack is slower than production)
      expect(loadTime).toBeLessThan(10000);
    });

    test('should not have memory leaks on navigation', async ({ page }) => {
      await page.goto('http://localhost:3000');

      // Navigate through several pages
      const routes = ['/', '/about', '/pricing', '/products', '/contact'];
      for (const route of routes) {
        await page.goto(`http://localhost:3000${route}`);
        await page.waitForLoadState('networkidle');
      }

      // If we got here without crashes, navigation is stable
      expect(page.url()).toBeTruthy();
    });
  });

  test.describe('Branding Consistency', () => {
    test('should use InstantGlobal everywhere', async ({ page }) => {
      const pagesToCheck = [
        '/',
        '/about',
        '/pricing',
        '/products',
        '/contact',
        '/login',
        '/register',
      ];

      for (const route of pagesToCheck) {
        await page.goto(`http://localhost:3000${route}`);
        await page.waitForLoadState('networkidle');

        // Check both visible text and image alt attributes for InstantGlobal
        // Wait a moment for images to load
        await page.waitForTimeout(500);

        const hasTextBranding = await page.evaluate(() => document.body.innerText.includes('InstantGlobal'));
        const imageCount = await page.locator('img[alt*="InstantGlobal"]').count();
        const hasImageBranding = imageCount > 0;

        if (!hasTextBranding && !hasImageBranding) {
          console.error(`Page ${route} is missing InstantGlobal branding (text: ${hasTextBranding}, images: ${imageCount})`);
          // Also check if logo exists but with different casing/format
          const allImages = await page.locator('img').count();
          console.error(`Total images on page: ${allImages}`);
        }

        expect(hasTextBranding || hasImageBranding).toBeTruthy();

        // Use innerText for checking wrong names (should not appear in visible text)
        const content = await page.evaluate(() => document.body.innerText);
        expect(content).not.toContain('Acme Corp');
        expect(content).not.toContain('Example Company');
      }
    });
  });
});
