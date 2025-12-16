import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const failedRequests = [];

  // Capture all failed requests
  page.on('requestfailed', request => {
    failedRequests.push({
      url: request.url(),
      failure: request.failure(),
      method: request.method(),
    });
  });

  page.on('response', async response => {
    if (response.status() >= 400) {
      let body = '';
      try {
        body = await response.text();
      } catch(e) {}

      failedRequests.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        method: response.request().method(),
        body: body.substring(0, 500),
      });
    }
  });

  console.log('Loading http://localhost:3000/dashboard...\n');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  console.log('\n=== FAILED REQUESTS (404s, 500s, etc.) ===\n');

  if (failedRequests.length === 0) {
    console.log('✓ No failed requests!');
  } else {
    failedRequests.forEach((req, i) => {
      console.log(`${i + 1}. ${req.method} ${req.url}`);
      if (req.status) console.log(`   Status: ${req.status} ${req.statusText}`);
      if (req.failure) console.log(`   Failure: ${req.failure.errorText}`);
      if (req.body) console.log(`   Body: ${req.body}`);
      console.log('');
    });
  }

  await browser.close();
})();
