// Fix to show search navigation when searching from main input

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Find the searchInCurrentPage function and modify it to show the search bar
const searchInCurrentPagePattern = /function searchInCurrentPage\(query\) \{[\s\S]*?clearSearchInPage\(\);[\s\S]*?return;[\s\S]*?\}/;

const match = html.match(searchInCurrentPagePattern);
if (match) {
    const originalFunction = match[0];
    
    // Modify to show search navigation
    const modifiedFunction = originalFunction.replace(
        'clearSearchInPage();',
        `clearSearchInPage();
            
            // Show the search navigation bar
            searchInPageActive = true;
            searchInPage.style.display = 'flex';
            searchInPageInput.value = query;`
    );
    
    html = html.replace(originalFunction, modifiedFunction);
    
    // Also ensure the main search input continues to update when viewing
    const inputHandlerPattern = /if \(currentState === 'viewing' && query\.length > 0\) \{[\s\S]*?searchInCurrentPage\(query\);[\s\S]*?return;[\s\S]*?\}/;
    
    if (inputHandlerPattern.test(html)) {
        html = html.replace(inputHandlerPattern, 
            `if (currentState === 'viewing') {
                if (query.length > 0) {
                    searchInCurrentPage(query);
                } else {
                    // Clear search when input is empty
                    clearSearchInPage();
                    searchInPageActive = false;
                    searchInPage.style.display = 'none';
                }
                return;
            }`
        );
    }
    
    fs.writeFileSync(indexPath, html);
    console.log('Successfully patched search display functionality');
    console.log('Search navigation will now show when searching from main input');
} else {
    console.error('Could not find searchInCurrentPage function');
}