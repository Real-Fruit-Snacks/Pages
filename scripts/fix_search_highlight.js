// This script patches the index.html to make the main search input
// also search within the current man page when in viewing state

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Find the search input event listener
const searchPattern = /searchInput\.addEventListener\('input', async \(e\) => \{[\s\S]*?searchTimeout = setTimeout\(async \(\) => \{[\s\S]*?displaySuggestions\(results\);[\s\S]*?\}, fullTextSearchEnabled \? 500 : 150\);[\s\S]*?\}\);/;

const replacement = `searchInput.addEventListener('input', async (e) => {
            const query = e.target.value;
            const fullTextSearchEnabled = false; // Removed full text search feature
            
            console.log(\`Input event: query="\${query}", fullTextSearch=\${fullTextSearchEnabled}\`);
            
            // If we're viewing a man page, search within it instead
            if (currentState === 'viewing' && query.length > 0) {
                searchInCurrentPage(query);
                return;
            }
            
            if (query.length > 0 && currentState === 'initial') {
                currentState = 'search';
                container.classList.add('search-active');
            }
            
            clearTimeout(searchTimeout);
            
            searchTimeout = setTimeout(async () => {
                let results;
                if (fullTextSearchEnabled) {
                    results = await searchInContent(query, sectionSelect.value);
                } else {
                    results = await searchManPages(query, sectionSelect.value);
                }
                console.log(\`Search completed, found \${results.length} results\`);
                displaySuggestions(results);
            }, fullTextSearchEnabled ? 500 : 150);
        });`;

if (searchPattern.test(html)) {
    html = html.replace(searchPattern, replacement);
    
    // Also need to ensure we clear search when closing man page
    const closePattern = /function closeManPage\(\) \{[\s\S]*?currentState = 'initial';/;
    const closeReplacement = `function closeManPage() {
            contentWrapper.style.display = 'none';
            container.classList.remove('search-active');
            searchInput.value = '';
            searchInput.focus();
            currentState = 'initial';
            
            // Clear any search highlights
            clearSearchInPage();`;
    
    if (closePattern.test(html)) {
        html = html.replace(closePattern, closeReplacement);
    }
    
    // Write the modified HTML back
    fs.writeFileSync(indexPath, html);
    console.log('Successfully patched index.html to enable search within man pages');
    console.log('When viewing a man page, typing in the search box will now search within that page');
} else {
    console.error('Could not find the search input event listener pattern');
}