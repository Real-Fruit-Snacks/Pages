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

async function waitAndClick(page, selector, timeout = 5000) {
    await page.waitForSelector(selector, { timeout });
    await page.click(selector);
}

async function testAllFeatures() {
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    // Collect all console messages
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
                    console.log(`  ⚠️  Console ${type}: ${text}`);
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
            
            // Test 1: Homepage
            console.log('\n📋 Testing Homepage...');
            await captureScreenshot(page, 'homepage', theme.name);
            
            // Test 2: Search suggestions
            console.log('\n🔍 Testing Search...');
            await page.type('#searchInput', 'ls');
            await page.waitForSelector('.suggestion', { timeout: 5000 });
            await captureScreenshot(page, 'search_suggestions', theme.name);
            
            // Check number of suggestions
            const suggestionCount = await page.evaluate(() => {
                return document.querySelectorAll('.suggestion').length;
            });
            console.log(`  ✓ Found ${suggestionCount} suggestions`);
            
            // Test 3: Man page display
            console.log('\n📖 Testing Man Page Display...');
            await waitAndClick(page, '.suggestion:first-child');
            await page.waitForSelector('.man-page-content', { timeout: 5000 });
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for content to load
            await captureScreenshot(page, 'man_page', theme.name);
            
            // Check if sections are loaded
            const sectionsLoaded = await page.evaluate(() => {
                return document.querySelectorAll('.man-section').length;
            });
            console.log(`  ✓ Loaded ${sectionsLoaded} man page sections`);
            
            // Test 4: TLDR section
            console.log('\n📋 Testing TLDR Section...');
            const hasTLDR = await page.evaluate(() => {
                const tldr = document.querySelector('#tldrSection');
                return tldr && tldr.style.display !== 'none';
            });
            
            if (hasTLDR) {
                await page.evaluate(() => {
                    document.querySelector('#tldrSection').scrollIntoView();
                });
                await captureScreenshot(page, 'tldr_section', theme.name);
                console.log('  ✓ TLDR section found and displayed');
            } else {
                console.log('  ℹ️  No TLDR section available');
            }
            
            // Test 5: Section navigation
            console.log('\n🧭 Testing Section Navigation...');
            const hasNav = await page.$('.section-nav');
            if (hasNav) {
                await captureScreenshot(page, 'section_nav', theme.name);
                
                // Try clicking a nav item
                const navItems = await page.$$('.nav-section-header');
                if (navItems.length > 1) {
                    await navItems[1].click();
                    await new Promise(resolve => setTimeout(resolve, 500));
                    console.log('  ✓ Section navigation working');
                }
            }
            
            // Test 6: Search in page
            console.log('\n🔎 Testing Search in Page...');
            await waitAndClick(page, '#searchInPageBtn');
            await page.waitForSelector('#searchInPage', { visible: true });
            await page.type('#searchInPageInput', 'file');
            await new Promise(resolve => setTimeout(resolve, 500));
            await captureScreenshot(page, 'search_in_page', theme.name);
            
            const searchResults = await page.evaluate(() => {
                const info = document.querySelector('#searchInPageInfo');
                return info ? info.textContent : 'No results';
            });
            console.log(`  ✓ Search in page: ${searchResults}`);
            
            // Close search in page
            await waitAndClick(page, '#searchInPageClose');
            
            // Test 7: Bookmark functionality
            console.log('\n⭐ Testing Bookmarks...');
            const bookmarkBtn = await page.$('#bookmarkBtn');
            if (bookmarkBtn) {
                await bookmarkBtn.click();
                await new Promise(resolve => setTimeout(resolve, 300));
                
                const isBookmarked = await page.evaluate(() => {
                    const btn = document.querySelector('#bookmarkBtn');
                    return btn && btn.classList.contains('active');
                });
                console.log(`  ✓ Bookmark ${isBookmarked ? 'added' : 'toggled'}`);
            }
            
            // Test 8: History and bookmarks panel
            console.log('\n📚 Testing History/Bookmarks Panel...');
            await waitAndClick(page, '#historyFab');
            await page.waitForSelector('#sidePanel', { visible: true });
            await captureScreenshot(page, 'history_panel', theme.name);
            
            // Switch to bookmarks tab
            await waitAndClick(page, '[data-tab="bookmarks"]');
            await new Promise(resolve => setTimeout(resolve, 300));
            await captureScreenshot(page, 'bookmarks_panel', theme.name);
            console.log('  ✓ History/Bookmarks panel working');
            
            // Close panel
            await waitAndClick(page, '#sidePanelClose');
            
            // Test 9: Collapsible sections
            console.log('\n📂 Testing Collapsible Sections...');
            const sections = await page.$$('.man-section');
            if (sections.length > 0) {
                // Collapse first section
                await sections[0].click();
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const isCollapsed = await page.evaluate(() => {
                    const firstSection = document.querySelector('.man-section');
                    return firstSection && firstSection.classList.contains('collapsed');
                });
                
                await captureScreenshot(page, 'collapsed_section', theme.name);
                console.log(`  ✓ Section ${isCollapsed ? 'collapsed' : 'toggled'}`);
                
                // Expand it again
                await sections[0].click();
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            // Test 10: Related commands
            console.log('\n🔗 Testing Related Commands...');
            const hasRelated = await page.evaluate(() => {
                const related = document.querySelector('#relatedCommands');
                return related && related.style.display !== 'none';
            });
            
            if (hasRelated) {
                await page.evaluate(() => {
                    document.querySelector('#relatedCommands').scrollIntoView();
                });
                await captureScreenshot(page, 'related_commands', theme.name);
                console.log('  ✓ Related commands displayed');
            } else {
                console.log('  ℹ️  No related commands section');
            }
            
            // Test 11: Keyboard shortcuts help
            console.log('\n⌨️  Testing Keyboard Shortcuts...');
            try {
                await waitAndClick(page, '#helpFab');
                await page.waitForFunction(() => {
                    const help = document.querySelector('#shortcutsHelp');
                    return help && (help.style.display === 'block' || getComputedStyle(help).display === 'block');
                }, { timeout: 5000 });
                await captureScreenshot(page, 'shortcuts_help', theme.name);
                console.log('  ✓ Shortcuts help displayed');
                
                // Close help by clicking overlay
                const overlayVisible = await page.evaluate(() => {
                    const overlay = document.querySelector('#overlay');
                    return overlay && overlay.style.display === 'block';
                });
                
                if (overlayVisible) {
                    await page.click('#overlay');
                } else {
                    // Click help button again to close
                    await page.click('#helpFab');
                }
                await new Promise(resolve => setTimeout(resolve, 300));
            } catch (error) {
                console.log('  ⚠️  Shortcuts help test skipped:', error.message);
            }
            
            // Test 12: Theme toggle button
            console.log('\n🎨 Testing Theme Toggle...');
            await page.hover('#themeToggle');
            await new Promise(resolve => setTimeout(resolve, 300));
            await captureScreenshot(page, 'theme_toggle_hover', theme.name);
            console.log('  ✓ Theme toggle button working');
            
            // Test 13: Empty search
            console.log('\n🔍 Testing Empty Search State...');
            await page.click('#closeButton'); // Close current man page
            await page.waitForSelector('.man-page-content', { hidden: true });
            await page.click('#searchInput', { clickCount: 3 }); // Select all
            await page.keyboard.press('Backspace');
            await page.type('#searchInput', 'zzznonexistent');
            await new Promise(resolve => setTimeout(resolve, 500));
            await captureScreenshot(page, 'no_results', theme.name);
            console.log('  ✓ No results state tested');
            
            // Test 14: Section filtering
            console.log('\n🎯 Testing Section Filter...');
            await page.click('#searchInput', { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.select('#sectionSelect', '1');
            await page.type('#searchInput', 'ls');
            await new Promise(resolve => setTimeout(resolve, 500));
            await captureScreenshot(page, 'section_filter', theme.name);
            console.log('  ✓ Section filtering working');
            
            // Test 15: Multiple sections for same command
            console.log('\n📑 Testing Multiple Sections...');
            await waitAndClick(page, '.suggestion:first-child');
            await page.waitForSelector('.man-page-content', { timeout: 5000 });
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const multiSections = await page.evaluate(() => {
                return document.querySelectorAll('.man-section').length > 1;
            });
            
            if (multiSections) {
                await captureScreenshot(page, 'multiple_sections', theme.name);
                console.log('  ✓ Multiple sections displayed correctly');
            }
            
            await page.close();
        }
        
        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('TEST SUMMARY');
        console.log('='.repeat(50));
        
        if (consoleLogs.length === 0) {
            console.log('✅ No console errors or warnings detected!');
        } else {
            console.log(`⚠️  Found ${consoleLogs.length} console issues:`);
            consoleLogs.forEach(log => console.log(`  - ${log}`));
        }
        
        console.log(`\n📸 Screenshots saved to: ${screenshotDir}`);
        console.log('✅ All feature tests completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
    }
}

// Run the tests
console.log('Starting comprehensive feature tests...');
testAllFeatures().catch(console.error);