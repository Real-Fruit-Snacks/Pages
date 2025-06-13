// Complete search fix - addresses all highlighting issues

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Fix 1: Ensure search navigation shows when using main search input
const searchInCurrentPagePattern = /function searchInCurrentPage\(query\) \{[\s\S]*?updateSearchInPageInfo\(\);\s*\}/;

const newSearchInCurrentPage = `function searchInCurrentPage(query) {
            if (!query) {
                clearSearchInPage();
                // Hide search navigation when query is empty
                searchInPageActive = false;
                searchInPage.style.display = 'none';
                return;
            }
            
            clearSearchInPage();
            
            // Show search navigation
            searchInPageActive = true;
            searchInPage.style.display = 'flex';
            searchInPageInput.value = query;
            
            const walker = document.createTreeWalker(
                manPageContent,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        // Skip if parent is already a highlight
                        if (node.parentNode.classList && node.parentNode.classList.contains('highlight')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                },
                false
            );
            
            let node;
            const regex = new RegExp(query.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'gi');
            
            while (node = walker.nextNode()) {
                const text = node.textContent;
                const matches = [...text.matchAll(regex)];
                
                if (matches.length > 0) {
                    const parent = node.parentNode;
                    
                    let lastIndex = 0;
                    const fragment = document.createDocumentFragment();
                    
                    matches.forEach(match => {
                        // Add text before the match
                        if (match.index > lastIndex) {
                            fragment.appendChild(
                                document.createTextNode(text.slice(lastIndex, match.index))
                            );
                        }
                        
                        // Create highlight span
                        const span = document.createElement('span');
                        span.className = 'highlight';
                        span.textContent = match[0];
                        fragment.appendChild(span);
                        searchInPageResults.push(span);
                        
                        lastIndex = match.index + match[0].length;
                    });
                    
                    // Add remaining text
                    if (lastIndex < text.length) {
                        fragment.appendChild(
                            document.createTextNode(text.slice(lastIndex))
                        );
                    }
                    
                    parent.replaceChild(fragment, node);
                }
            }
            
            if (searchInPageResults.length > 0) {
                searchInPageCurrentIndex = 0;
                highlightCurrentResult();
            }
            
            updateSearchInPageInfo();
        }`;

if (searchInCurrentPagePattern.test(html)) {
    html = html.replace(searchInCurrentPagePattern, newSearchInCurrentPage);
    console.log('✓ Fixed searchInCurrentPage function');
} else {
    console.error('✗ Could not find searchInCurrentPage function');
}

// Fix 2: Ensure clearSearchInPage properly resets state
const clearSearchPattern = /function clearSearchInPage\(\) \{[\s\S]*?updateSearchInPageInfo\(\);\s*\}/;

const newClearSearch = `function clearSearchInPage() {
            // Remove all highlights
            const highlights = manPageContent.querySelectorAll('.highlight');
            highlights.forEach(el => {
                const parent = el.parentNode;
                parent.replaceChild(document.createTextNode(el.textContent), el);
                parent.normalize();
            });
            searchInPageResults = [];
            searchInPageCurrentIndex = -1;
            updateSearchInPageInfo();
        }`;

if (clearSearchPattern.test(html)) {
    html = html.replace(clearSearchPattern, newClearSearch);
    console.log('✓ Fixed clearSearchInPage function');
} else {
    console.error('✗ Could not find clearSearchInPage function');
}

// Write the modified HTML
fs.writeFileSync(indexPath, html);
console.log('✓ Applied comprehensive search highlighting fix');
console.log('✓ Search will now highlight ALL occurrences of the search term');
console.log('✓ Search navigation will be visible when searching from main input');