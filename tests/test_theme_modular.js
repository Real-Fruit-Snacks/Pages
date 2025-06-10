const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testThemes() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    try {
        console.log('Testing modular theme system...');
        
        // Navigate to the app
        await page.goto('http://localhost:8000', { waitUntil: 'networkidle2' });
        console.log('Page loaded');

        // Search for a command to test with
        await page.type('#searchInput', 'ls');
        await page.waitForSelector('.suggestion', { timeout: 5000 });
        
        // Click the first suggestion
        await page.click('.suggestion');
        await page.waitForSelector('.man-page-content', { timeout: 5000 });
        console.log('Man page loaded');

        // Test each theme
        const themes = ['Light', 'Dark', 'Solarized', 'Dracula', 'Monokai', 'High Contrast'];
        
        for (let i = 0; i < themes.length; i++) {
            console.log(`Testing ${themes[i]} theme...`);
            
            // Click theme toggle button
            await page.click('#themeToggle');
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait for transition
            
            // Check if CSS file is loaded
            const cssLoaded = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
                return links.map(link => link.href);
            });
            console.log('Loaded CSS files:', cssLoaded.filter(url => url.includes('themes/')));
            
            // Check body classes
            const bodyClasses = await page.evaluate(() => document.body.className);
            console.log(`Body classes: ${bodyClasses || '(none)'}`);
            
            // Take screenshot
            const screenshotPath = path.join(__dirname, `test_screenshots/theme_${themes[i].toLowerCase().replace(' ', '_')}.png`);
            await page.screenshot({ path: screenshotPath, fullPage: false });
            console.log(`Screenshot saved: ${screenshotPath}`);
        }
        
        console.log('All themes tested successfully!');
        
    } catch (error) {
        console.error('Error during testing:', error);
    } finally {
        await browser.close();
    }
}

// Create screenshots directory if it doesn't exist
if (!fs.existsSync('test_screenshots')) {
    fs.mkdirSync('test_screenshots');
}

testThemes().catch(console.error);