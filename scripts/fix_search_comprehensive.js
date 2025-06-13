// Comprehensive fix for search highlighting to find ALL occurrences
// This script patches the searchInCurrentPage function to not skip any elements

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Find the searchInCurrentPage function
const searchFunctionPattern = /function searchInCurrentPage\(query\) \{[\s\S]*?updateSearchInPageInfo\(\);\s*\}/;

// Create the replacement function as a string literal to avoid escaping issues
const newSearchFunction = `function searchInCurrentPage(query) {
            if (!query) {
                clearSearchInPage();
                return;
            }
            
            clearSearchInPage();
            
            const walker = document.createTreeWalker(
                manPageContent,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            let node;
            const regex = new RegExp(query.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'gi');
            
            while (node = walker.nextNode()) {
                const matches = [...node.textContent.matchAll(regex)];
                if (matches.length > 0) {
                    const parent = node.parentNode;
                    
                    // Don't process if we're already inside a highlight span
                    if (parent.classList && parent.classList.contains('highlight')) {
                        continue;
                    }
                    
                    let lastIndex = 0;
                    const fragment = document.createDocumentFragment();
                    
                    matches.forEach(match => {
                        if (match.index > lastIndex) {
                            fragment.appendChild(
                                document.createTextNode(node.textContent.slice(lastIndex, match.index))
                            );
                        }
                        
                        const span = document.createElement('span');
                        span.className = 'highlight';
                        span.textContent = match[0];
                        fragment.appendChild(span);
                        searchInPageResults.push(span);
                        
                        lastIndex = match.index + match[0].length;
                    });
                    
                    if (lastIndex < node.textContent.length) {
                        fragment.appendChild(
                            document.createTextNode(node.textContent.slice(lastIndex))
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

if (searchFunctionPattern.test(html)) {
    html = html.replace(searchFunctionPattern, newSearchFunction);
    fs.writeFileSync(indexPath, html);
    console.log('Successfully patched searchInCurrentPage function');
    console.log('The search will now highlight ALL occurrences, including those in styled elements');
} else {
    console.error('Could not find searchInCurrentPage function');
}