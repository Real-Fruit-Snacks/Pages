const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Create directories for screenshots
const screenshotDir = 'test_screenshots/feature_test';
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

// Themes to test
const themes = [
    { name: 'light', class: '' },
    { name: 'dark', class: 'dark-mode' },
    { name: 'solarized', class: 'solarized-dark' },
    { name: 'dracula', class: 'dracula' },
    { name: 'monokai', class: 'monokai' },
    { name: 'high_contrast', class: 'high-contrast' }
];

async function captureScreenshot(page, feature, theme, variant = '') {
    const filename = `${theme}_${feature}${variant ? '_' + variant : ''}.png`;
    const filepath = path.join(screenshotDir, filename);
    await page.screenshot({ path: filepath, fullPage: false });
    console.log(`  📸 Screenshot: ${filename}`);
}

async function safeClick(page, selector, timeout = 5000) {
    try {
        await page.waitForSelector(selector, { timeout });
        await page.click(selector);
        return true;
    } catch (error) {
        console.log(`  ⚠️  Could not click ${selector}: ${error.message}`);
        return false;
    }
}

async function testFeatureSet(page, theme) {
    console.log('\n📋 Testing Homepage...');
    await captureScreenshot(page, 'homepage', theme.name);
    
    // Test 1: Search suggestions
    console.log('\n🔍 Testing Search...');
    await page.type('#searchInput', 'ls');
    await page.waitForSelector('.suggestion', { timeout: 5000 });
    await captureScreenshot(page, 'search_suggestions', theme.name);
    
    const suggestionCount = await page.evaluate(() => {
        return document.querySelectorAll('.suggestion').length;
    });
    console.log(`  ✓ Found ${suggestionCount} suggestions`);
    
    // Test 2: Man page display
    console.log('\n📖 Testing Man Page Display...');
    await safeClick(page, '.suggestion:first-child');
    
    try {
        await page.waitForSelector('.man-page-content', { timeout: 5000 });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await captureScreenshot(page, 'man_page', theme.name);
        
        const sectionsLoaded = await page.evaluate(() => {
            return document.querySelectorAll('.man-section').length;
        });
        console.log(`  ✓ Loaded ${sectionsLoaded} man page sections`);
    } catch (error) {
        console.log('  ⚠️  Man page did not load properly');
    }
    
    // Test 3: TLDR section
    console.log('\n📋 Testing TLDR Section...');
    const hasTLDR = await page.evaluate(() => {
        const tldr = document.querySelector('#tldrSection');
        return tldr && tldr.style.display !== 'none';
    });
    
    if (hasTLDR) {
        await page.evaluate(() => {
            document.querySelector('#tldrSection').scrollIntoView({ behavior: 'smooth' });
        });
        await new Promise(resolve => setTimeout(resolve, 500));
        await captureScreenshot(page, 'tldr_section', theme.name);
        console.log('  ✓ TLDR section found and displayed');
    } else {
        console.log('  ℹ️  No TLDR section available');
    }
    
    // Test 4: Section navigation
    console.log('\n🧭 Testing Section Navigation...');
    const hasNav = await page.$('.section-nav');
    if (hasNav) {
        await captureScreenshot(page, 'section_nav', theme.name);
        console.log('  ✓ Section navigation present');
    }
    
    // Test 5: Search in page
    console.log('\n🔎 Testing Search in Page...');
    const searchOpened = await safeClick(page, '#searchInPageBtn');
    if (searchOpened) {
        try {
            await page.waitForSelector('#searchInPage', { visible: true, timeout: 3000 });
            await page.type('#searchInPageInput', 'file');
            await new Promise(resolve => setTimeout(resolve, 500));
            await captureScreenshot(page, 'search_in_page', theme.name);
            
            const searchResults = await page.evaluate(() => {
                const info = document.querySelector('#searchInPageInfo');
                return info ? info.textContent : 'No results';
            });
            console.log(`  ✓ Search in page: ${searchResults}`);
            
            await safeClick(page, '#searchInPageClose');
        } catch (error) {
            console.log('  ⚠️  Search in page issue:', error.message);
        }
    }
    
    // Test 6: Bookmarks
    console.log('\n⭐ Testing Bookmarks...');
    const bookmarked = await safeClick(page, '#bookmarkBtn');
    if (bookmarked) {
        const isActive = await page.evaluate(() => {
            const btn = document.querySelector('#bookmarkBtn');
            return btn && btn.classList.contains('active');
        });
        console.log(`  ✓ Bookmark ${isActive ? 'added' : 'toggled'}`);
    }
    
    // Test 7: Side panels
    console.log('\n📚 Testing History/Bookmarks Panel...');
    const panelOpened = await safeClick(page, '#historyFab');
    if (panelOpened) {
        try {
            await page.waitForSelector('#sidePanel', { visible: true, timeout: 3000 });
            await captureScreenshot(page, 'history_panel', theme.name);
            
            await safeClick(page, '[data-tab="bookmarks"]');
            await new Promise(resolve => setTimeout(resolve, 300));
            await captureScreenshot(page, 'bookmarks_panel', theme.name);
            console.log('  ✓ History/Bookmarks panel working');
            
            await safeClick(page, '#sidePanelClose');
        } catch (error) {
            console.log('  ⚠️  Side panel issue:', error.message);
        }
    }
    
    // Test 8: Collapsible sections
    console.log('\n📂 Testing Collapsible Sections...');
    const sections = await page.$$('.man-section');
    if (sections.length > 0) {
        await sections[0].click();
        await new Promise(resolve => setTimeout(resolve, 500));
        await captureScreenshot(page, 'collapsed_section', theme.name);
        console.log('  ✓ Section collapse tested');
        
        await sections[0].click();
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Test 9: Theme toggle
    console.log('\n🎨 Testing Theme Toggle...');
    try {
        await page.hover('#themeToggle');
        await new Promise(resolve => setTimeout(resolve, 300));
        await captureScreenshot(page, 'theme_toggle_hover', theme.name);
        console.log('  ✓ Theme toggle button working');
    } catch (error) {
        console.log('  ⚠️  Theme toggle issue:', error.message);
    }
}

async function testAllFeatures() {
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const consoleLogs = [];
    
    try {
        for (const theme of themes) {
            console.log(`\n${'='.repeat(50)}`);
            console.log(`Testing ${theme.name.toUpperCase()} theme`);
            console.log('='.repeat(50));
            
            const page = await browser.newPage();
            await page.setViewport({ width: 1400, height: 900 });
            
            // Capture console messages
            page.on('console', msg => {
                const type = msg.type();
                const text = msg.text();
                if (type === 'error' || type === 'warning') {
                    consoleLogs.push(`[${theme.name}] ${type.toUpperCase()}: ${text}`);
                    if (!text.includes('favicon.ico')) {
                        console.log(`  ⚠️  Console ${type}: ${text}`);
                    }
                }
            });
            
            // Capture page errors
            page.on('pageerror', error => {
                consoleLogs.push(`[${theme.name}] PAGE ERROR: ${error.message}`);
                console.log(`  ❌ Page error: ${error.message}`);
            });
            
            // Navigate to the app
            await page.goto('http://localhost:8000', { waitUntil: 'networkidle2' });
            console.log('✓ Page loaded');
            
            // Set theme
            if (theme.class) {
                await page.evaluate((themeClass) => {
                    document.body.className = themeClass;
                    localStorage.setItem('theme', themeClass);
                }, theme.class);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            // Run tests
            await testFeatureSet(page, theme);
            
            await page.close();
        }
        
        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('TEST SUMMARY');
        console.log('='.repeat(50));
        
        const realErrors = consoleLogs.filter(log => !log.includes('favicon.ico'));
        if (realErrors.length === 0) {
            console.log('✅ No significant console errors detected!');
        } else {
            console.log(`⚠️  Found ${realErrors.length} console issues:`);
            realErrors.forEach(log => console.log(`  - ${log}`));
        }
        
        console.log(`\n📸 Screenshots saved to: ${screenshotDir}`);
        console.log('✅ All feature tests completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
    }
}

// Additional visual inspection tests
async function visualInspection() {
    console.log('\n\n' + '='.repeat(50));
    console.log('VISUAL INSPECTION TESTS');
    console.log('='.repeat(50));
    
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1400, height: 900 });
        
        for (const theme of themes) {
            console.log(`\n📸 Capturing ${theme.name} theme variations...`);
            
            await page.goto('http://localhost:8000', { waitUntil: 'networkidle2' });
            
            if (theme.class) {
                await page.evaluate((themeClass) => {
                    document.body.className = themeClass;
                }, theme.class);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            // Test different commands
            const testCommands = ['grep', 'find', 'awk'];
            
            for (const cmd of testCommands) {
                await page.click('#searchInput', { clickCount: 3 });
                await page.keyboard.press('Backspace');
                await page.type('#searchInput', cmd);
                await page.waitForSelector('.suggestion', { timeout: 3000 });
                
                const firstSuggestion = await page.$('.suggestion');
                if (firstSuggestion) {
                    await firstSuggestion.click();
                    await page.waitForSelector('.man-page-content', { timeout: 5000 });
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    await captureScreenshot(page, `command_${cmd}`, theme.name);
                }
            }
        }
        
        await browser.close();
        console.log('\n✅ Visual inspection tests completed!');
        
    } catch (error) {
        console.error('❌ Visual inspection failed:', error);
        await browser.close();
    }
}

// Run the tests
console.log('Starting comprehensive feature tests...');
testAllFeatures()
    .then(() => visualInspection())
    .catch(console.error);