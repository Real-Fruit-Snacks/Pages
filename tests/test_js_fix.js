const puppeteer = require('puppeteer');

async function testJSFix() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    let hasError = false;
    
    page.on('pageerror', error => {
        console.log('❌ Page error:', error.message);
        hasError = true;
    });
    
    page.on('console', msg => {
        if (msg.type() === 'error' && !msg.text().includes('favicon')) {
            console.log('❌ Console error:', msg.text());
            hasError = true;
        }
    });
    
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle2' });
    
    // Test theme switching
    await page.click('#themeToggle');
    await new Promise(resolve => setTimeout(resolve, 500));
    await page.click('#themeToggle');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await browser.close();
    
    if (!hasError) {
        console.log('✅ No JavaScript errors detected!');
    } else {
        console.log('⚠️  JavaScript errors still present');
    }
}

testJSFix().catch(console.error);