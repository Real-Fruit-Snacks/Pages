const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  try {
    console.log('1. Loading page...');
    await page.goto('http://localhost:8001/index.html', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    console.log('2. Searching for tcpdump...');
    await page.type('#searchInput', 'tcpdump');
    await new Promise(r => setTimeout(r, 500));
    
    // Click on tcpdump result
    const tcpdumpResult = await page.$('div.suggestion-item');
    if (tcpdumpResult) {
      await tcpdumpResult.click();
      await new Promise(r => setTimeout(r, 1000));
    }
    
    console.log('3. Checking if man page loaded...');
    const manPageContent = await page.$eval('#manPageContent', el => el.textContent.substring(0, 200));
    console.log('Man page preview:', manPageContent);
    
    console.log('4. Clearing search and searching for -p...');
    await page.click('#searchInput');
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.type('#searchInput', '-p');
    await new Promise(r => setTimeout(r, 500));
    
    console.log('5. Checking search highlighting...');
    // Get the highlighted content
    const highlightedElements = await page.$$eval('mark', elements => 
      elements.map(el => ({
        text: el.textContent,
        context: el.parentElement.textContent.substring(0, 100)
      }))
    );
    
    console.log('Found', highlightedElements.length, 'highlighted elements');
    highlightedElements.forEach((el, i) => {
      console.log(`  ${i + 1}. "${el.text}" in context: "${el.context}..."`);
    });
    
    // Check if -p option is in the content
    const searchPattern = '-p';
    const optionPExists = await page.evaluate((pattern) => {
      const content = document.getElementById('manPageContent').textContent;
      const index = content.indexOf('       -p\n');
      if (index > -1) {
        return {
          found: true,
          index: index,
          context: content.substring(index, index + 200)
        };
      }
      return { found: false };
    }, searchPattern);
    
    console.log('6. Direct search for -p option:');
    if (optionPExists.found) {
      console.log('  Found at index:', optionPExists.index);
      console.log('  Context:', optionPExists.context);
    } else {
      console.log('  NOT FOUND in content');
    }
    
    // Check the search/highlight function
    console.log('7. Analyzing search function...');
    const searchFunction = await page.evaluate(() => {
      // Get the performSearch function if it exists
      if (typeof window.performManPageSearch === 'function') {
        return window.performManPageSearch.toString();
      }
      return 'Function not found';
    });
    console.log('Search function:', searchFunction.substring(0, 500) + '...');
    
    // Test the search with different patterns
    console.log('8. Testing different search patterns...');
    const patterns = ['-p', '\\-p', '-p\\b', 'promiscuous'];
    for (const pattern of patterns) {
      await page.click('#searchInput');
      await page.keyboard.down('Control');
      await page.keyboard.press('A');
      await page.keyboard.up('Control');
      await page.type('#searchInput', pattern);
      await new Promise(r => setTimeout(r, 300));
      
      const markCount = await page.$$eval('mark', elements => elements.length);
      console.log(`  Pattern "${pattern}": ${markCount} matches`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();