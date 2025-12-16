import { chromium } from '@playwright/test';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  // Get the full HTML
  const html = await page.content();

  // Save to file for inspection
  fs.writeFileSync('page-full.html', html);
  console.log('Saved full HTML to page-full.html');

  // Search for "InstantGlobalPay" in the HTML
  const matches = html.match(/InstantGlobalPay/g);
  if (matches) {
    console.log(`\nFound ${matches.length} instances of "InstantGlobalPay" in HTML`);

    // Find and print context around each match
    let lastIndex = 0;
    for (let i = 0; i < Math.min(matches.length, 10); i++) {
      const index = html.indexOf('InstantGlobalPay', lastIndex);
      if (index === -1) break;

      const start = Math.max(0, index - 100);
      const end = Math.min(html.length, index + 100);
      const context = html.substring(start, end);

      console.log(`\n--- Match ${i + 1} ---`);
      console.log(context);
      console.log('---');

      lastIndex = index + 1;
    }
  } else {
    console.log('\nNo instances of "InstantGlobalPay" found in HTML!');
  }

  // Also get visible text only
  const visibleText = await page.evaluate(() => {
    return document.body.innerText;
  });

  if (visibleText.includes('InstantGlobalPay')) {
    console.log('\n⚠️ "InstantGlobalPay" found in VISIBLE text');
  } else {
    console.log('\n✓ "InstantGlobalPay" NOT in visible text');
  }

  if (visibleText.includes('Acme')) {
    console.log('⚠️ "Acme" found in VISIBLE text');
  } else {
    console.log('✓ "Acme" NOT in visible text');
  }

  await browser.close();
})();
