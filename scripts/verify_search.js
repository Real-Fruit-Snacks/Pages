// Verify what's happening with the search

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // Show browser
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE:', msg.text()));
  
  try {
    console.log('1. Loading page...');
    await page.goto('http://localhost:8001/', { 
      waitUntil: 'networkidle0'
    });
    
    console.log('2. Searching and clicking tcpdump...');
    await page.type('#searchInput', 'tcpdump');
    await new Promise(r => setTimeout(r, 500));
    
    // Click first result
    const firstResult = await page.waitForSelector('.suggestion-item', { timeout: 5000 });
    await firstResult.click();
    
    // Wait for content to load
    await new Promise(r => setTimeout(r, 3000));
    
    console.log('3. Analyzing loaded content...');
    const contentAnalysis = await page.evaluate(() => {
      const content = document.getElementById('manPageContent');
      const text = content.textContent;
      
      // Count -p occurrences
      const pMatches = text.match(/-p/g) || [];
      
      // Find specific -p option
      const pOptionIndex = text.indexOf('       -p');
      let pOptionContext = '';
      if (pOptionIndex > -1) {
        pOptionContext = text.substring(pOptionIndex, pOptionIndex + 200).replace(/\s+/g, ' ');
      }
      
      return {
        contentLength: text.length,
        pCount: pMatches.length,
        hasContent: text.length > 100,
        firstChars: text.substring(0, 100),
        pOptionFound: pOptionIndex > -1,
        pOptionContext: pOptionContext,
        currentState: window.currentState
      };
    });
    
    console.log('Content analysis:', contentAnalysis);
    
    console.log('\n4. Testing search...');
    await page.click('#searchInput');
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.type('#searchInput', '-p');
    await new Promise(r => setTimeout(r, 1000));
    
    console.log('5. Checking search results...');
    const searchResults = await page.evaluate(() => {
      // Check highlights
      const highlights = document.querySelectorAll('.highlight');
      
      // Check search bar
      const searchBar = document.getElementById('searchInPage');
      const searchInfo = document.getElementById('searchInPageInfo');
      
      // Manual count
      const content = document.getElementById('manPageContent');
      const walker = document.createTreeWalker(
        content,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      let manualCount = 0;
      let node;
      while (node = walker.nextNode()) {
        const matches = node.textContent.match(/-p/g);
        if (matches) {
          manualCount += matches.length;
        }
      }
      
      return {
        highlightCount: highlights.length,
        searchBarDisplay: searchBar.style.display,
        searchInfoText: searchInfo.textContent,
        manualCount: manualCount,
        searchInPageActive: window.searchInPageActive
      };
    });
    
    console.log('Search results:', searchResults);
    
    console.log('\nPress Enter to close browser...');
    await new Promise(resolve => process.stdin.once('data', resolve));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
    process.exit(0);
  }
})();