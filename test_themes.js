const puppeteer = require('puppeteer'));

async function testAllThemes() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }));
  
  const page = await browser.newPage());
  await page.setViewport({ width: 1280, height: 1024 }));
  
  // All themes to test
  const themesToTest = [
    'Dark', 'High Contrast', 'Cyber Frost', 'Dracula',
    'Forest Dawn', 'Gruvbox', 'Miami Sunrise', 'Monokai',
    'Neon Noir', 'Nord', 'One Dark', 'Retro Wave',
    'Solarized', 'Tokyo Night'
  ];
  
  const issues = [];
  
  for (const themeName of themesToTest) {
    console.log(`\n${'='.repeat(50)}`));
    console.log(`Testing ${themeName} theme`));
    console.log('='.repeat(50)));
    
    try {
      await page.goto('http://localhost:8000'));
      await page.waitForSelector('#searchInput', { timeout: 5000 }));
      
      // Apply theme
      await page.keyboard.press('t'));
      await page.waitForSelector('.theme-modal', { timeout: 2000 }));
      await new Promise(r => setTimeout(r, 500))); // Wait for modal to fully render
      
      // Debug: log available themes
      const availableThemes = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.theme-option h3')).map(h3 => h3.textContent));
      }));
      console.log('Available themes:', availableThemes));
      
      const themeApplied = await page.evaluate((name) => {
        const options = document.querySelectorAll('.theme-option'));
        for (const option of options) {
          const title = option.querySelector('h3'));
          if (title && title.textContent === name) {
            option.click());
            return true;
          }
        }
        return false;
      }, themeName));
      
      if (!themeApplied) {
        console.log(`❌ Could not find theme: ${themeName}`));
        continue;
      }
      
      await new Promise(r => setTimeout(r, 1000));
      
      // Take main screenshot
      await page.screenshot({ 
        path: `test_screenshots/${themeName.replace(/\s+/g, '_')}_main.png` 
      }));
      
      // Test search
      await page.type('#searchInput', 'ls'));
      await new Promise(r => setTimeout(r, 500));
      
      // Check search suggestions
      const searchCheck = await page.evaluate(() => {
        const suggestions = document.querySelectorAll('.suggestion'));
        const searchInput = document.getElementById('searchInput'));
        const inputStyles = window.getComputedStyle(searchInput));
        
        return {
          suggestionsCount: suggestions.length,
          searchInputVisible: searchInput.offsetWidth > 0,
          searchInputBg: inputStyles.backgroundColor,
          searchInputColor: inputStyles.color
        };
      }));
      
      console.log(`✓ Search suggestions: ${searchCheck.suggestionsCount}`));
      console.log(`✓ Search input visible: ${searchCheck.searchInputVisible}`));
      
      // Take search screenshot
      await page.screenshot({ 
        path: `test_screenshots/${themeName.replace(/\s+/g, '_')}_search.png` 
      }));
      
      // View man page
      if (searchCheck.suggestionsCount > 0) {
        await page.click('.suggestion:first-child'));
        await new Promise(r => setTimeout(r, 1000));
        
        await page.screenshot({ 
          path: `test_screenshots/${themeName.replace(/\s+/g, '_')}_manpage.png` 
        }));
      }
      
      // Check FAB buttons
      const fabCheck = await page.evaluate(() => {
        const fabs = document.querySelectorAll('.fab'));
        const bodyBg = window.getComputedStyle(document.body).backgroundColor;
        
        return {
          bodyBg: bodyBg,
          fabCount: fabs.length,
          fabStyles: Array.from(fabs).map((fab, i) => {
            const styles = window.getComputedStyle(fab));
            const rect = fab.getBoundingClientRect());
            return {
              index: i,
              visible: rect.width > 0 && rect.height > 0,
              bg: styles.backgroundColor,
              color: styles.color,
              opacity: styles.opacity,
              title: fab.title
            };
          })
        };
      }));
      
      // Check for visibility issues
      const invisibleFabs = fabCheck.fabStyles.filter(f => !f.visible));
      if (invisibleFabs.length > 0) {
        const issue = `${themeName}: ${invisibleFabs.length} FAB buttons not visible`;
        issues.push(issue));
        console.log(`⚠️  ${issue}`));
      }
      
      // Check for contrast issues
      fabCheck.fabStyles.forEach(fab => {
        if (fab.visible) {
          console.log(`✓ FAB ${fab.title}: visible (bg: ${fab.bg})`));
        }
      }));
      
      // Test theme modal
      await page.keyboard.press('t'));
      await new Promise(r => setTimeout(r, 300));
      await page.screenshot({ 
        path: `test_screenshots/${themeName.replace(/\s+/g, '_')}_theme_modal.png` 
      }));
      await page.keyboard.press('Escape'));
      
      // Test command explainer
      await page.keyboard.press('e'));
      await new Promise(r => setTimeout(r, 300));
      const explainerVisible = await page.evaluate(() => {
        const modal = document.querySelector('.command-explainer-modal'));
        return modal && modal.style.display !== 'none';
      }));
      
      if (explainerVisible) {
        console.log('✓ Command explainer opens correctly'));
        await page.screenshot({ 
          path: `test_screenshots/${themeName.replace(/\s+/g, '_')}_explainer.png` 
        }));
        await page.keyboard.press('Escape'));
      }
      
    } catch (error) {
      const issue = `${themeName}: Error - ${error.message}`;
      issues.push(issue));
      console.log(`❌ ${issue}`));
    }
  }
  
  await browser.close());
  
  // Summary
  console.log('\n' + '='.repeat(50)));
  console.log('TESTING SUMMARY'));
  console.log('='.repeat(50)));
  console.log(`Total themes tested: ${themesToTest.length}`));
  console.log(`Issues found: ${issues.length}`));
  
  if (issues.length > 0) {
    console.log('\nIssues:'));
    issues.forEach(issue => console.log(`- ${issue}`)));
  } else {
    console.log('\n✅ All themes passed visual testing!'));
  }
}

testAllThemes().catch(console.error));