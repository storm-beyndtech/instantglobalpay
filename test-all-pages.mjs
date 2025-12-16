import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  const warnings = [];
  const pageErrors = {};

  // Listen to console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();

    if (type === 'error') {
      errors.push({ page: page.url(), error: text });
      console.log(`[ERROR on ${page.url()}] ${text}`);
    } else if (type === 'warning') {
      warnings.push({ page: page.url(), warning: text });
    }
  });

  // Listen to page errors
  page.on('pageerror', error => {
    const currentUrl = page.url();
    if (!pageErrors[currentUrl]) pageErrors[currentUrl] = [];
    pageErrors[currentUrl].push(error.toString());
    console.log(`[PAGE ERROR on ${currentUrl}] ${error.toString()}`);
  });

  const dashboardPages = [
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

  console.log('Testing all dashboard pages...\n');

  for (const path of dashboardPages) {
    console.log(`Testing ${path}...`);
    try {
      await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle', timeout: 10000 });
      await page.waitForTimeout(2000);
    } catch (e) {
      console.log(`  ⚠️ Failed to load: ${e.message}`);
    }
  }

  console.log('\n\n=== SUMMARY ===');
  console.log(`Total Errors: ${errors.length}`);
  console.log(`Total Warnings: ${warnings.length}`);

  if (errors.length > 0) {
    console.log('\n=== ERRORS BY PAGE ===');
    const errorsByPage = errors.reduce((acc, { page, error }) => {
      if (!acc[page]) acc[page] = [];
      acc[page].push(error);
      return acc;
    }, {});

    Object.entries(errorsByPage).forEach(([page, errs]) => {
      console.log(`\n${page}:`);
      const unique = [...new Set(errs)];
      unique.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
    });
  }

  if (Object.keys(pageErrors).length > 0) {
    console.log('\n=== PAGE ERRORS (Uncaught) ===');
    Object.entries(pageErrors).forEach(([page, errs]) => {
      console.log(`\n${page}:`);
      errs.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
    });
  }

  await browser.close();
})();
