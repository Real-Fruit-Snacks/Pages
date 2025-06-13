// Debug script to understand the search issue

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Enable detailed console logging
  page.on('console', msg => {
    if (msg.type() === 'log') {
      console.log('PAGE LOG:', msg.text());
    }
  });
  
  try {
    console.log('Loading page...');
    await page.goto('http://localhost:8001/', { 
      waitUntil: 'networkidle0'
    });
    
    // Inject debugging into searchInCurrentPage
    await page.evaluate(() => {
      const originalSearch = window.searchInCurrentPage;
      window.searchInCurrentPage = function(query) {
        console.log('searchInCurrentPage called with:', query);
        
        // Call original function
        originalSearch.call(this, query);
        
        // Debug what happened
        const highlights = document.querySelectorAll('.highlight');
        console.log('After search, found highlights:', highlights.length);
        
        // Check the text walker
        const walker = document.createTreeWalker(
          document.getElementById('manPageContent'),
          NodeFilter.SHOW_TEXT,
          null,
          false
        );
        
        let textNodes = 0;
        let matchingNodes = 0;
        const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        
        let node;
        while (node = walker.nextNode()) {
          textNodes++;
          const matches = [...node.textContent.matchAll(regex)];
          if (matches.length > 0) {
            matchingNodes++;
            console.log(`Node ${textNodes}: Found ${matches.length} matches in:`, 
                       node.textContent.substring(0, 50));
          }
        }
        
        console.log(`Total text nodes: ${textNodes}, Nodes with matches: ${matchingNodes}`);
      };
    });
    
    // Load tcpdump
    console.log('\nLoading tcpdump...');
    await page.evaluate(() => {
      window.displayManPage('tcpdump', '1');
    });
    
    await page.waitForSelector('#manPageContent', { timeout: 5000 });
    await new Promise(r => setTimeout(r, 2000));
    
    // Search for -p
    console.log('\nSearching for -p...');
    await page.evaluate(() => {
      const input = document.getElementById('searchInput');
      input.value = '-p';
      input.dispatchEvent(new Event('input'));
    });
    
    await new Promise(r => setTimeout(r, 1000));
    
    // Final check
    const result = await page.evaluate(() => {
      const content = document.getElementById('manPageContent').textContent;
      const highlights = document.querySelectorAll('.highlight');
      return {
        totalInContent: (content.match(/-p/g) || []).length,
        totalHighlights: highlights.length,
        searchBarVisible: document.getElementById('searchInPage').style.display,
        searchInfo: document.getElementById('searchInPageInfo').textContent
      };
    });
    
    console.log('\nFinal result:', result);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
    process.exit(0);
  }
})();