import { chromium } from '@playwright/test';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: false }); // headless: false to see what happens
  const context = await browser.newContext();
  const page = await context.newPage();

  const logs = [];
  const networkErrors = [];

  // Listen to all console messages
  page.on('console', msg => {
    const log = `[${msg.type().toUpperCase()}] ${msg.text()}`;
    logs.push(log);
    console.log(log);
  });

  // Listen to page errors
  page.on('pageerror', error => {
    const log = `[UNCAUGHT ERROR] ${error.toString()}\n${error.stack}`;
    logs.push(log);
    console.log(log);
  });

  // Listen to failed network requests
  page.on('response', response => {
    if (response.status() >= 400) {
      const log = `[NETWORK ${response.status()}] ${response.url()}`;
      networkErrors.push(log);
      console.log(log);
    }
  });

  console.log('=== Testing Dashboard Page ===\n');

  try {
    console.log('Navigating to /dashboard...');
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle', timeout: 15000 });

    console.log('\nWaiting 5 seconds for all components to load...');
    await page.waitForTimeout(5000);

    const url = page.url();
    console.log(`\nFinal URL: ${url}`);

    const title = await page.title();
    console.log(`Page Title: ${title}`);

    // Check if redirected to login
    if (url.includes('/login')) {
      console.log('\n⚠️ REDIRECTED TO LOGIN PAGE - Not authenticated');

      // Take screenshot
      await page.screenshot({ path: 'login-page.png', fullPage: true });
      console.log('Screenshot saved to login-page.png');
    } else {
      // Take screenshot of dashboard
      await page.screenshot({ path: 'dashboard-page.png', fullPage: true });
      console.log('Screenshot saved to dashboard-page.png');

      // Check what's visible
      const dashboardShellExists = await page.locator('[class*="DashboardShell"]').count() > 0;
      const sidebarExists = await page.locator('aside').count() > 0;
      const topNavExists = await page.locator('header').count() > 0;

      console.log(`\nComponent Check:`);
      console.log(`  Dashboard Shell: ${dashboardShellExists ? '✓' : '✗'}`);
      console.log(`  Sidebar: ${sidebarExists ? '✓' : '✗'}`);
      console.log(`  Top Nav: ${topNavExists ? '✓' : '✗'}`);

      // Get all text on page (first 500 chars)
      const bodyText = await page.locator('body').textContent();
      console.log(`\nPage Content Preview (first 500 chars):`);
      console.log(bodyText?.substring(0, 500) || 'No content');
    }

    console.log(`\n=== SUMMARY ===`);
    console.log(`Network Errors: ${networkErrors.length}`);
    console.log(`Console Logs Captured: ${logs.length}`);

    if (networkErrors.length > 0) {
      console.log('\n=== NETWORK ERRORS ===');
      networkErrors.forEach(err => console.log(err));
    }

    // Save all logs to file
    fs.writeFileSync('test-logs.txt', logs.join('\n'));
    console.log('\nAll logs saved to test-logs.txt');

  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
  }

  console.log('\nClosing browser in 3 seconds...');
  await page.waitForTimeout(3000);
  await browser.close();
})();
