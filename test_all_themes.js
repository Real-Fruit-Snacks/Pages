const puppeteer = require('puppeteer');
const fs = require('fs');

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testAllThemes() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });
  
  const report = [];
  
  // First, get the list of available themes
  await page.goto('http://localhost:8000');
  await page.waitForSelector('#searchInput');
  
  const availableThemes = await page.evaluate(() => {
    return window.themes.map(t => ({ name: t.name, index: window.themes.indexOf(t) }));
  });
  
  console.log(`Found ${availableThemes.length} themes to test\n`);
  
  for (const theme of availableThemes) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing Theme: ${theme.name} (index: ${theme.index})`);
    console.log('='.repeat(60));
    
    const themeReport = {
      name: theme.name,
      tests: [],
      issues: []
    };
    
    try {
      // Apply theme directly via JavaScript
      await page.evaluate((themeIndex) => {
        window.applyTheme(window.themes[themeIndex]);
      }, theme.index);
      
      await wait(1000);
      
      // Test 1: Main Interface
      console.log('📸 Testing main interface...');
      await page.screenshot({ 
        path: `test_screenshots/${theme.name.replace(/\s+/g, '_')}_01_main.png` 
      });
      
      const mainInterfaceCheck = await page.evaluate(() => {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const body = document.body;
        
        return {
          bodyClass: body.className,
          searchInputVisible: searchInput && searchInput.offsetWidth > 0,
          searchBtnVisible: searchBtn && searchBtn.offsetWidth > 0,
          bodyBg: window.getComputedStyle(body).backgroundColor,
          searchInputBg: searchInput ? window.getComputedStyle(searchInput).backgroundColor : 'N/A',
          searchInputColor: searchInput ? window.getComputedStyle(searchInput).color : 'N/A'
        };
      });
      
      console.log(`✓ Body class: ${mainInterfaceCheck.bodyClass}`);
      console.log(`✓ Search input visible: ${mainInterfaceCheck.searchInputVisible}`);
      themeReport.tests.push({ test: 'Main Interface', passed: mainInterfaceCheck.searchInputVisible });
      
      // Test 2: Search Functionality
      console.log('📸 Testing search functionality...');
      await page.click('#searchInput');
      await page.type('#searchInput', 'grep');
      await wait(800);
      
      const searchResults = await page.evaluate(() => {
        const suggestions = document.querySelectorAll('.suggestion');
        return {
          count: suggestions.length,
          visible: suggestions.length > 0 && suggestions[0].offsetHeight > 0
        };
      });
      
      console.log(`✓ Search results: ${searchResults.count} suggestions`);
      await page.screenshot({ 
        path: `test_screenshots/${theme.name.replace(/\s+/g, '_')}_02_search.png` 
      });
      themeReport.tests.push({ test: 'Search Results', passed: searchResults.visible });
      
      // Test 3: Man Page Viewer
      if (searchResults.count > 0) {
        console.log('📸 Testing man page viewer...');
        await page.click('.suggestion:first-child');
        await wait(1000);
        
        const manPageCheck = await page.evaluate(() => {
          const viewer = document.getElementById('manPageViewer');
          const content = document.getElementById('manPageContent');
          return {
            visible: viewer && viewer.style.display !== 'none',
            hasContent: content && content.textContent.length > 100
          };
        });
        
        console.log(`✓ Man page visible: ${manPageCheck.visible}`);
        console.log(`✓ Has content: ${manPageCheck.hasContent}`);
        await page.screenshot({ 
          path: `test_screenshots/${theme.name.replace(/\s+/g, '_')}_03_manpage.png` 
        });
        themeReport.tests.push({ test: 'Man Page Display', passed: manPageCheck.visible && manPageCheck.hasContent });
      }
      
      // Test 4: FAB Buttons Visibility
      console.log('📸 Testing FAB buttons...');
      const fabCheck = await page.evaluate(() => {
        const fabs = document.querySelectorAll('.fab');
        const bodyStyles = window.getComputedStyle(document.body);
        
        return Array.from(fabs).map(fab => {
          const styles = window.getComputedStyle(fab);
          const rect = fab.getBoundingClientRect();
          
          // Calculate perceived contrast
          const isVisible = rect.width > 0 && rect.height > 0 && styles.opacity !== '0';
          
          return {
            title: fab.title,
            visible: isVisible,
            background: styles.backgroundColor,
            color: styles.color,
            position: `${rect.left},${rect.top}`
          };
        });
      });
      
      const invisibleFabs = fabCheck.filter(f => !f.visible);
      if (invisibleFabs.length > 0) {
        const issue = `${invisibleFabs.length} FAB buttons not visible`;
        themeReport.issues.push(issue);
        console.log(`⚠️  ${issue}`);
      } else {
        console.log(`✓ All ${fabCheck.length} FAB buttons visible`);
      }
      themeReport.tests.push({ test: 'FAB Visibility', passed: invisibleFabs.length === 0 });
      
      // Test 5: Theme Modal
      console.log('📸 Testing theme modal...');
      await page.keyboard.press('t');
      await wait(500);
      
      const themeModalCheck = await page.evaluate(() => {
        const modal = document.querySelector('.theme-modal');
        return modal && modal.style.display !== 'none';
      });
      
      if (themeModalCheck) {
        await page.screenshot({ 
          path: `test_screenshots/${theme.name.replace(/\s+/g, '_')}_04_theme_modal.png` 
        });
        await page.keyboard.press('Escape');
        console.log('✓ Theme modal opens correctly');
      }
      themeReport.tests.push({ test: 'Theme Modal', passed: themeModalCheck });
      
      // Test 6: Command Explainer
      console.log('📸 Testing command explainer...');
      await wait(500);
      await page.keyboard.press('e');
      await wait(500);
      
      const explainerCheck = await page.evaluate(() => {
        const modal = document.querySelector('.command-explainer-modal');
        return modal && modal.style.display !== 'none';
      });
      
      if (explainerCheck) {
        await page.screenshot({ 
          path: `test_screenshots/${theme.name.replace(/\s+/g, '_')}_05_explainer.png` 
        });
        await page.keyboard.press('Escape');
        console.log('✓ Command explainer opens correctly');
      }
      themeReport.tests.push({ test: 'Command Explainer', passed: explainerCheck });
      
      // Clear for next theme
      await page.reload();
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      themeReport.issues.push(`Test error: ${error.message}`);
    }
    
    report.push(themeReport);
  }
  
  await browser.close();
  
  // Generate summary report
  console.log('\n' + '='.repeat(60));
  console.log('COMPREHENSIVE THEME TESTING SUMMARY');
  console.log('='.repeat(60));
  
  let totalTests = 0;
  let totalPassed = 0;
  let totalIssues = 0;
  
  report.forEach(theme => {
    const passed = theme.tests.filter(t => t.passed).length;
    const total = theme.tests.length;
    totalTests += total;
    totalPassed += passed;
    totalIssues += theme.issues.length;
    
    console.log(`\n${theme.name}: ${passed}/${total} tests passed`);
    if (theme.issues.length > 0) {
      theme.issues.forEach(issue => console.log(`  ⚠️  ${issue}`));
    }
  });
  
  console.log('\n' + '-'.repeat(60));
  console.log(`Total: ${totalPassed}/${totalTests} tests passed across ${report.length} themes`);
  console.log(`Issues found: ${totalIssues}`);
  
  // Update QA report
  const qaReport = `
## Automated Testing Results - ${new Date().toISOString()}

### Summary
- Themes tested: ${report.length}
- Total tests: ${totalTests}
- Tests passed: ${totalPassed}
- Issues found: ${totalIssues}

### Theme-by-Theme Results

${report.map(theme => `
#### ${theme.name}
- Tests passed: ${theme.tests.filter(t => t.passed).length}/${theme.tests.length}
${theme.tests.map(t => `- ${t.test}: ${t.passed ? '✅' : '❌'}`).join('\n')}
${theme.issues.length > 0 ? `\nIssues:\n${theme.issues.map(i => `- ${i}`).join('\n')}` : ''}
`).join('\n')}
`;
  
  fs.appendFileSync('THEME_QA_REPORT.md', qaReport);
  console.log('\n✅ Report updated in THEME_QA_REPORT.md');
}

testAllThemes().catch(console.error);