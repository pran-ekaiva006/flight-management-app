const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Log console messages
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  // Log network requests
  page.on('request', request => {
    if (request.url().includes('/signup') || request.url().includes('supabase')) {
      console.log('REQUEST:', request.method(), request.url());
    }
  });
  
  page.on('response', async response => {
    if (response.url().includes('/signup') || response.url().includes('supabase')) {
      console.log('RESPONSE:', response.status(), response.url());
    }
  });

  console.log('Navigating to signup...');
  await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle0' });
  
  console.log('Filling form...');
  await page.type('input[name="fullName"]', 'Pup Test');
  await page.type('input[name="email"]', `pup${Date.now()}@example.com`);
  await page.type('input[name="password"]', 'password123');
  await page.type('input[name="confirmPassword"]', 'password123');
  
  console.log('Clicking submit...');
  await page.click('button[type="submit"]');
  
  console.log('Waiting for network requests to finish...');
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('Current URL after 2s:', page.url());
  
  await new Promise(r => setTimeout(r, 3000));
  console.log('Current URL after 5s:', page.url());

  const html = await page.content();
  if (html.includes('Account created')) {
    console.log('SUCCESS: Toast text found in DOM!');
  } else {
    console.log('ERROR: Toast text not found in DOM!');
  }

  await browser.close();
})();
