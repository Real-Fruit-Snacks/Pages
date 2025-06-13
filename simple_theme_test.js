const puppeteer = require('puppeteer');

async function testThemes() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  console.log('Starting theme testing...\n');
  
  // List of all 16 themes with their indices
  const themes = [
    { index: 0, name: 'Cyber_Frost' },
    { index: 1, name: 'Dark' },
    { index: 2, name: 'Dracula' },
    { index: 3, name: 'Forest_Dawn' },
    { index: 4, name: 'Gruvbox' },
    { index: 5, name: 'High_Contrast' },
    { index: 6, name: 'Light' },
    { index: 7, name: 'Miami_Sunrise' },
    { index: 8, name: 'Monokai' },
    { index: 9, name: 'Neon_Noir' },
    { index: 10, name: 'Nord' },
    { index: 11, name: 'Ocean_Depth' },
    { index: 12, name: 'One_Dark' },
    { index: 13, name: 'Retro_Wave' },
    { index: 14, name: 'Solarized' },
    { index: 15, name: 'Tokyo_Night' }
  ];
  
  for (const theme of themes) {
    console.log(`Testing ${theme.name}...`);
    
    try {
      // Navigate to the page
      await page.goto('http://localhost:8000');
      await page.waitForSelector('#searchInput', { timeout: 5000 });
      
      // Apply theme via console
      await page.evaluate((idx) => {
        if (window.themes && window.themes[idx]) {
          window.applyTheme(window.themes[idx]);
        }
      }, theme.index);
      
      // Wait for theme to apply
      await new Promise(r => setTimeout(r, 1000));
      
      // Take screenshot of main interface
      await page.screenshot({ 
        path: `test_screenshots/${theme.name}_main.png` 
      });
      
      // Test search
      await page.type('#searchInput', 'ls');
      await new Promise(r => setTimeout(r, 500));
      
      // Check if suggestions appear
      const hasSuggestions = await page.evaluate(() => {
        return document.querySelectorAll('.suggestion').length > 0;
      });
      
      if (hasSuggestions) {
        await page.screenshot({ 
          path: `test_screenshots/${theme.name}_search.png` 
        });
        
        // Click first suggestion
        await page.click('.suggestion:first-child');
        await new Promise(r => setTimeout(r, 1000));
        
        await page.screenshot({ 
          path: `test_screenshots/${theme.name}_manpage.png` 
        });
      }
      
      // Check FAB buttons visibility
      const fabVisibility = await page.evaluate(() => {
        const fabs = document.querySelectorAll('.fab');
        return Array.from(fabs).map(fab => {
          const rect = fab.getBoundingClientRect();
          const styles = window.getComputedStyle(fab);
          return {
            visible: rect.width > 0 && rect.height > 0,
            title: fab.title,
            bg: styles.backgroundColor
          };
        });
      });
      
      const invisibleCount = fabVisibility.filter(f => !f.visible).length;
      if (invisibleCount > 0) {
        console.log(`  ⚠️  ${theme.name}: ${invisibleCount} FAB buttons not visible`);
      } else {
        console.log(`  ✅ ${theme.name}: All FAB buttons visible`);
      }
      
    } catch (error) {
      console.log(`  ❌ ${theme.name}: Error - ${error.message}`);
    }
  }
  
  await browser.close();
  console.log('\nTheme testing complete!');
}

testThemes().catch(console.error);