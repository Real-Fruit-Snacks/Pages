# Critical Items Implementation Plan

## Phase 1: Security Fixes (Days 1-3)

### Day 1: Create Security Utilities and Audit

#### 1.1 Create `security.js` module
```javascript
// security.js
export const Security = {
    // HTML escaping function
    escapeHtml(unsafe) {
        const div = document.createElement('div');
        div.textContent = unsafe;
        return div.innerHTML;
    },
    
    // Sanitize command input
    sanitizeCommand(input) {
        // Remove potential script injections
        return input
            .replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .substring(0, 1000); // Limit length
    },
    
    // Validate regex patterns
    validateRegex(pattern) {
        try {
            // Test for catastrophic backtracking
            const testString = 'a'.repeat(100);
            const regex = new RegExp(pattern);
            const start = performance.now();
            regex.test(testString);
            const duration = performance.now() - start;
            
            // Reject if takes too long (potential ReDoS)
            return duration < 50;
        } catch (e) {
            return false;
        }
    },
    
    // Safe DOM manipulation
    safeSetHTML(element, html) {
        // Use DOMPurify if available, fallback to textContent
        if (window.DOMPurify) {
            element.innerHTML = DOMPurify.sanitize(html);
        } else {
            element.textContent = html;
        }
    }
};
```

#### 1.2 Audit all innerHTML usage
```bash
# Find all innerHTML occurrences
grep -n "innerHTML" index.html > innerHTML_audit.txt

# Priority replacements:
# - User input areas (search, command explainer)
# - Dynamic content generation
# - Man page rendering
```

### Day 2: Replace Unsafe DOM Manipulation

#### 2.1 Fix Command Explainer Input
```javascript
// BEFORE (UNSAFE):
commandBreakdown.innerHTML = tokenHTML;

// AFTER (SAFE):
function displayParsedCommand(tokens) {
    commandBreakdown.textContent = ''; // Clear safely
    
    tokens.forEach(token => {
        const tokenEl = document.createElement('div');
        tokenEl.className = `command-token ${token.type}`;
        
        const tokenText = document.createElement('span');
        tokenText.textContent = token.value; // Safe text content
        tokenEl.appendChild(tokenText);
        
        const tooltip = document.createElement('div');
        tooltip.className = 'token-tooltip';
        tooltip.textContent = token.description; // Safe text content
        tokenEl.appendChild(tooltip);
        
        commandBreakdown.appendChild(tokenEl);
    });
}
```

#### 2.2 Fix Search Suggestions
```javascript
// BEFORE (UNSAFE):
suggestion.innerHTML = `
    <div class="suggestion-info">
        <div class="suggestion-command">${result.command}</div>
        <div class="suggestion-desc">${result.description}</div>
    </div>
`;

// AFTER (SAFE):
function createSuggestionElement(result) {
    const suggestion = document.createElement('div');
    suggestion.className = 'suggestion';
    
    const info = document.createElement('div');
    info.className = 'suggestion-info';
    
    const command = document.createElement('div');
    command.className = 'suggestion-command';
    command.textContent = result.command; // Safe
    
    const desc = document.createElement('div');
    desc.className = 'suggestion-desc';
    desc.textContent = result.description || 'No description'; // Safe
    
    info.appendChild(command);
    info.appendChild(desc);
    suggestion.appendChild(info);
    
    return suggestion;
}
```

#### 2.3 Fix Man Page Content Rendering
```javascript
// Create safe rendering pipeline
function renderManPageContent(rawContent) {
    // Step 1: Create container
    const container = document.createElement('div');
    
    // Step 2: Parse content safely
    const lines = rawContent.split('\n');
    const fragment = document.createDocumentFragment();
    
    lines.forEach(line => {
        const lineEl = processManPageLine(line);
        fragment.appendChild(lineEl);
    });
    
    container.appendChild(fragment);
    return container;
}

function processManPageLine(line) {
    const div = document.createElement('div');
    
    // Detect line type safely
    if (/^[A-Z][A-Z\s]+$/.test(line.trim())) {
        div.className = 'section-header';
        div.textContent = line;
    } else if (line.includes('<command>')) {
        // Parse safely without innerHTML
        const parts = line.split(/(<command>|<\/command>)/);
        parts.forEach((part, i) => {
            if (part === '<command>') {
                // Skip tag
            } else if (part === '</command>') {
                // Skip tag
            } else if (i > 0 && parts[i-1] === '<command>') {
                const span = document.createElement('span');
                span.className = 'command';
                span.textContent = part;
                div.appendChild(span);
            } else {
                div.appendChild(document.createTextNode(part));
            }
        });
    } else {
        div.textContent = line;
    }
    
    return div;
}
```

### Day 3: Input Validation & Testing

#### 3.1 Implement Command Input Validation
```javascript
class CommandValidator {
    constructor() {
        this.maxLength = 1000;
        this.dangerousPatterns = [
            /(\$\(.*\)){3,}/, // Nested command substitution
            /`{3,}/, // Multiple backticks
            /[;&|]{10,}/, // Excessive operators
            /<script/i, // Script tags
            /javascript:/i // JavaScript protocol
        ];
    }
    
    validate(input) {
        // Length check
        if (input.length > this.maxLength) {
            return {
                valid: false,
                error: `Command too long (max ${this.maxLength} characters)`
            };
        }
        
        // Dangerous pattern check
        for (const pattern of this.dangerousPatterns) {
            if (pattern.test(input)) {
                return {
                    valid: false,
                    error: 'Invalid command syntax detected'
                };
            }
        }
        
        // Balanced quotes/brackets check
        if (!this.checkBalanced(input)) {
            return {
                valid: false,
                error: 'Unbalanced quotes or brackets'
            };
        }
        
        return { valid: true };
    }
    
    checkBalanced(input) {
        const stack = [];
        const pairs = {
            '(': ')',
            '[': ']',
            '{': '}',
            '"': '"',
            "'": "'"
        };
        
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
            
            if (pairs[char]) {
                if (char === '"' || char === "'") {
                    // Handle quotes
                    if (stack[stack.length - 1] === char) {
                        stack.pop();
                    } else {
                        stack.push(char);
                    }
                } else {
                    stack.push(char);
                }
            } else if (Object.values(pairs).includes(char)) {
                const last = stack.pop();
                if (pairs[last] !== char) {
                    return false;
                }
            }
        }
        
        return stack.length === 0;
    }
}
```

#### 3.2 Security Test Suite
```javascript
// security.test.js
describe('Security Tests', () => {
    test('XSS Prevention', () => {
        const malicious = '<script>alert("XSS")</script>';
        const safe = Security.escapeHtml(malicious);
        expect(safe).not.toContain('<script>');
        expect(safe).toBe('&lt;script&gt;alert("XSS")&lt;/script&gt;');
    });
    
    test('Command Injection Prevention', () => {
        const malicious = 'ls; rm -rf /';
        const validated = new CommandValidator().validate(malicious);
        expect(validated.valid).toBe(true); // Should parse safely
        
        const tokens = commandParser.parse(malicious);
        expect(tokens).toHaveLength(5); // ls, ;, rm, -rf, /
    });
    
    test('ReDoS Prevention', () => {
        const maliciousRegex = '(a+)+$';
        const isValid = Security.validateRegex(maliciousRegex);
        expect(isValid).toBe(false);
    });
});
```

## Phase 2: Performance Optimization (Days 4-7)

### Day 4: Lazy Theme Loading

#### 4.1 Remove Static Theme Links
```html
<!-- REMOVE these from <head>: -->
<link rel="stylesheet" href="themes/dark.css">
<link rel="stylesheet" href="themes/solarized-dark.css">
<!-- ... etc ... -->
```

#### 4.2 Implement Dynamic Theme Loader
```javascript
// themeLoader.js
class ThemeLoader {
    constructor() {
        this.loadedThemes = new Map();
        this.activeTheme = null;
        this.themeLink = null;
    }
    
    async loadTheme(themeName) {
        // Return if already loaded
        if (this.activeTheme === themeName) {
            return;
        }
        
        // Remove previous theme
        if (this.themeLink) {
            this.themeLink.remove();
        }
        
        // Check cache
        if (this.loadedThemes.has(themeName)) {
            this.applyTheme(themeName, this.loadedThemes.get(themeName));
            return;
        }
        
        // Load new theme
        try {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `themes/${themeName}.css`;
            
            // Promise to track loading
            const loadPromise = new Promise((resolve, reject) => {
                link.onload = resolve;
                link.onerror = reject;
            });
            
            document.head.appendChild(link);
            await loadPromise;
            
            this.themeLink = link;
            this.activeTheme = themeName;
            
            // Cache the theme
            this.loadedThemes.set(themeName, link.href);
            
            // Update body class
            document.body.className = themeName;
            
            // Save preference
            localStorage.setItem('selectedTheme', themeName);
            
        } catch (error) {
            console.error(`Failed to load theme: ${themeName}`, error);
            this.loadFallbackTheme();
        }
    }
    
    loadFallbackTheme() {
        // Inline critical styles for fallback
        const style = document.createElement('style');
        style.textContent = `
            body { 
                background: #1a1a1a; 
                color: #e0e0e0; 
            }
            .search-box { 
                background: #2a2a2a; 
                color: #fff; 
            }
        `;
        document.head.appendChild(style);
    }
    
    preloadTheme(themeName) {
        // Preload but don't apply
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = `themes/${themeName}.css`;
        document.head.appendChild(link);
    }
}

// Initialize on page load
const themeLoader = new ThemeLoader();
const savedTheme = localStorage.getItem('selectedTheme') || 'ocean-depth';
themeLoader.loadTheme(savedTheme);
```

### Day 5: Search Input Debouncing

#### 5.1 Implement Debounce Utility
```javascript
// utils/debounce.js
export function debounce(func, wait = 300) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Progressive debounce - shorter delay for more specific queries
export function progressiveDebounce(func, minWait = 100, maxWait = 500) {
    let timeout;
    
    return function executedFunction(...args) {
        const input = args[0];
        const inputLength = input?.length || 0;
        
        // Calculate delay based on input length
        const wait = Math.max(
            minWait,
            maxWait - (inputLength * 50)
        );
        
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
```

#### 5.2 Apply to Search Input
```javascript
// searchManager.js
class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.suggestions = document.getElementById('suggestions');
        this.currentRequest = null;
        
        // Debounced search
        this.debouncedSearch = progressiveDebounce(
            this.performSearch.bind(this),
            100, // Min delay for long queries
            500  // Max delay for short queries
        );
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            // Immediate feedback
            this.showSearchingIndicator();
            
            // Cancel previous search
            if (this.currentRequest) {
                this.currentRequest.cancel = true;
            }
            
            if (query.length === 0) {
                this.clearSuggestions();
                return;
            }
            
            // Debounced search
            this.debouncedSearch(query);
        });
    }
    
    showSearchingIndicator() {
        // Show subtle loading state
        this.searchInput.style.backgroundImage = 
            'url("data:image/svg+xml;base64,...")'; // Spinner SVG
    }
    
    async performSearch(query) {
        const request = { cancel: false };
        this.currentRequest = request;
        
        try {
            const results = await this.searchWithTimeout(query, 1000);
            
            if (!request.cancel) {
                this.displayResults(results);
            }
        } catch (error) {
            if (!request.cancel) {
                this.showError('Search failed');
            }
        } finally {
            this.hideSearchingIndicator();
        }
    }
    
    searchWithTimeout(query, timeout) {
        return Promise.race([
            this.actualSearch(query),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), timeout)
            )
        ]);
    }
}
```

### Day 6: DOM Optimization

#### 6.1 Use DocumentFragment for Batch Updates
```javascript
// domOptimizer.js
class DOMOptimizer {
    static batchUpdate(container, items, createElementFunc) {
        // Clear container efficiently
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        
        // Use DocumentFragment for batch insertion
        const fragment = document.createDocumentFragment();
        
        items.forEach(item => {
            const element = createElementFunc(item);
            fragment.appendChild(element);
        });
        
        // Single DOM update
        container.appendChild(fragment);
    }
    
    static recycleElements(container, items, updateFunc) {
        const existingElements = container.children;
        const fragment = document.createDocumentFragment();
        
        items.forEach((item, index) => {
            let element;
            
            if (index < existingElements.length) {
                // Reuse existing element
                element = existingElements[index];
                updateFunc(element, item);
            } else {
                // Create new element
                element = updateFunc(null, item);
            }
            
            fragment.appendChild(element);
        });
        
        // Remove excess elements
        while (container.children.length > items.length) {
            container.removeChild(container.lastChild);
        }
        
        // Update DOM once
        container.appendChild(fragment);
    }
}
```

#### 6.2 Virtual Scrolling for Search Results
```javascript
// virtualScroller.js
class VirtualScroller {
    constructor(container, itemHeight = 60) {
        this.container = container;
        this.itemHeight = itemHeight;
        this.items = [];
        this.visibleRange = { start: 0, end: 0 };
        
        this.scrollContainer = container.parentElement;
        this.scrollContainer.addEventListener('scroll', 
            debounce(this.onScroll.bind(this), 16)
        );
        
        // Create viewport
        this.viewport = document.createElement('div');
        this.viewport.style.position = 'relative';
        container.appendChild(this.viewport);
    }
    
    setItems(items) {
        this.items = items;
        this.updateHeight();
        this.render();
    }
    
    updateHeight() {
        const totalHeight = this.items.length * this.itemHeight;
        this.container.style.height = `${totalHeight}px`;
    }
    
    onScroll() {
        const scrollTop = this.scrollContainer.scrollTop;
        const containerHeight = this.scrollContainer.clientHeight;
        
        const start = Math.floor(scrollTop / this.itemHeight);
        const end = Math.ceil((scrollTop + containerHeight) / this.itemHeight);
        
        // Add buffer for smooth scrolling
        this.visibleRange = {
            start: Math.max(0, start - 5),
            end: Math.min(this.items.length, end + 5)
        };
        
        this.render();
    }
    
    render() {
        const { start, end } = this.visibleRange;
        const visibleItems = this.items.slice(start, end);
        
        // Clear viewport
        this.viewport.innerHTML = '';
        
        // Render visible items
        const fragment = document.createDocumentFragment();
        
        visibleItems.forEach((item, index) => {
            const element = this.createItemElement(item);
            element.style.position = 'absolute';
            element.style.top = `${(start + index) * this.itemHeight}px`;
            element.style.height = `${this.itemHeight}px`;
            fragment.appendChild(element);
        });
        
        this.viewport.appendChild(fragment);
    }
    
    createItemElement(item) {
        // Override in subclass
        const div = document.createElement('div');
        div.textContent = item.command;
        return div;
    }
}

// Use for search results
class SearchResultsScroller extends VirtualScroller {
    createItemElement(result) {
        const element = document.createElement('div');
        element.className = 'suggestion';
        
        // Safe content creation
        const command = document.createElement('div');
        command.className = 'suggestion-command';
        command.textContent = result.command;
        
        const desc = document.createElement('div');
        desc.className = 'suggestion-desc';
        desc.textContent = result.description;
        
        element.appendChild(command);
        element.appendChild(desc);
        
        // Click handler
        element.addEventListener('click', () => {
            displayManPage(result.command, result.section);
        });
        
        return element;
    }
}
```

### Day 7: Memory Management

#### 7.1 Event Listener Cleanup
```javascript
// eventManager.js
class EventManager {
    constructor() {
        this.listeners = new Map();
        this.delegatedHandlers = new Map();
    }
    
    on(element, event, handler, options = {}) {
        if (!this.listeners.has(element)) {
            this.listeners.set(element, new Map());
        }
        
        const elementListeners = this.listeners.get(element);
        if (!elementListeners.has(event)) {
            elementListeners.set(event, new Set());
        }
        
        elementListeners.get(event).add(handler);
        element.addEventListener(event, handler, options);
    }
    
    off(element, event, handler) {
        const elementListeners = this.listeners.get(element);
        if (!elementListeners) return;
        
        const eventHandlers = elementListeners.get(event);
        if (!eventHandlers) return;
        
        eventHandlers.delete(handler);
        element.removeEventListener(event, handler);
        
        // Cleanup empty maps
        if (eventHandlers.size === 0) {
            elementListeners.delete(event);
        }
        if (elementListeners.size === 0) {
            this.listeners.delete(element);
        }
    }
    
    delegate(parent, selector, event, handler) {
        const delegatedHandler = (e) => {
            const target = e.target.closest(selector);
            if (target && parent.contains(target)) {
                handler.call(target, e);
            }
        };
        
        this.on(parent, event, delegatedHandler);
        
        // Store for cleanup
        const key = `${selector}:${event}`;
        if (!this.delegatedHandlers.has(parent)) {
            this.delegatedHandlers.set(parent, new Map());
        }
        this.delegatedHandlers.get(parent).set(key, delegatedHandler);
    }
    
    cleanup(element = null) {
        if (element) {
            // Clean specific element
            const elementListeners = this.listeners.get(element);
            if (elementListeners) {
                elementListeners.forEach((handlers, event) => {
                    handlers.forEach(handler => {
                        element.removeEventListener(event, handler);
                    });
                });
                this.listeners.delete(element);
            }
            
            // Clean delegated handlers
            this.delegatedHandlers.delete(element);
        } else {
            // Clean all
            this.listeners.forEach((elementListeners, element) => {
                elementListeners.forEach((handlers, event) => {
                    handlers.forEach(handler => {
                        element.removeEventListener(event, handler);
                    });
                });
            });
            this.listeners.clear();
            this.delegatedHandlers.clear();
        }
    }
}

// Global instance
const eventManager = new EventManager();

// Usage in components
class Component {
    constructor(element) {
        this.element = element;
        this.eventManager = eventManager;
    }
    
    destroy() {
        // Clean up all listeners for this component
        this.eventManager.cleanup(this.element);
    }
}
```

#### 7.2 Memory Leak Prevention
```javascript
// memoryManager.js
class MemoryManager {
    constructor() {
        this.cache = new Map();
        this.observers = new WeakMap();
        this.timers = new Set();
    }
    
    // LRU Cache with size limit
    createLRUCache(maxSize = 50) {
        return new LRUCache(maxSize);
    }
    
    // Safe observer pattern
    observe(target, callback) {
        if (!this.observers.has(target)) {
            this.observers.set(target, new Set());
        }
        this.observers.get(target).add(callback);
    }
    
    unobserve(target, callback) {
        const callbacks = this.observers.get(target);
        if (callbacks) {
            callbacks.delete(callback);
        }
    }
    
    // Timer management
    setTimeout(callback, delay) {
        const timer = setTimeout(() => {
            this.timers.delete(timer);
            callback();
        }, delay);
        this.timers.add(timer);
        return timer;
    }
    
    clearTimeout(timer) {
        clearTimeout(timer);
        this.timers.delete(timer);
    }
    
    // Cleanup all resources
    cleanup() {
        // Clear all timers
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers.clear();
        
        // Clear caches
        this.cache.clear();
        
        // Note: WeakMap cleans itself up
    }
}

class LRUCache {
    constructor(maxSize = 50) {
        this.maxSize = maxSize;
        this.cache = new Map();
    }
    
    get(key) {
        if (!this.cache.has(key)) return null;
        
        // Move to end (most recently used)
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        
        return value;
    }
    
    set(key, value) {
        // Remove if exists
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        
        // Add to end
        this.cache.set(key, value);
        
        // Remove oldest if over limit
        if (this.cache.size > this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
    }
    
    clear() {
        this.cache.clear();
    }
}
```

## Phase 3: Integration & Testing (Days 8-10)

### Day 8: Integration

#### 8.1 Create Main Application Structure
```javascript
// app.js
import { Security } from './modules/security.js';
import { ThemeLoader } from './modules/themeLoader.js';
import { SearchManager } from './modules/searchManager.js';
import { EventManager } from './modules/eventManager.js';
import { MemoryManager } from './modules/memoryManager.js';

class LinuxManPagesApp {
    constructor() {
        this.security = Security;
        this.themeLoader = new ThemeLoader();
        this.searchManager = new SearchManager();
        this.eventManager = new EventManager();
        this.memoryManager = new MemoryManager();
        
        this.init();
    }
    
    async init() {
        try {
            // Load saved theme
            await this.loadSavedTheme();
            
            // Initialize components
            this.initializeSearch();
            this.initializeNavigation();
            this.initializeCommandExplainer();
            
            // Set up global error handling
            this.setupErrorHandling();
            
            // Performance monitoring
            this.setupPerformanceMonitoring();
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to load application');
        }
    }
    
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            // Send to error tracking service
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            // Send to error tracking service
        });
    }
    
    setupPerformanceMonitoring() {
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) {
                        console.warn('Long task detected:', entry);
                    }
                }
            });
            
            observer.observe({ entryTypes: ['longtask'] });
        }
    }
    
    destroy() {
        // Cleanup all resources
        this.eventManager.cleanup();
        this.memoryManager.cleanup();
        this.searchManager.destroy();
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new LinuxManPagesApp();
    });
} else {
    window.app = new LinuxManPagesApp();
}
```

### Day 9: Testing Setup

#### 9.1 Unit Tests for Security
```javascript
// __tests__/security.test.js
import { Security } from '../modules/security.js';

describe('Security Module', () => {
    describe('escapeHtml', () => {
        test('escapes HTML tags', () => {
            const input = '<script>alert("XSS")</script>';
            const output = Security.escapeHtml(input);
            expect(output).toBe('&lt;script&gt;alert("XSS")&lt;/script&gt;');
        });
        
        test('escapes HTML attributes', () => {
            const input = '<img src="x" onerror="alert(1)">';
            const output = Security.escapeHtml(input);
            expect(output).not.toContain('onerror');
        });
        
        test('preserves safe text', () => {
            const input = 'Hello World & Friends';
            const output = Security.escapeHtml(input);
            expect(output).toBe('Hello World &amp; Friends');
        });
    });
    
    describe('sanitizeCommand', () => {
        test('removes script tags', () => {
            const input = 'ls <script>alert(1)</script> -la';
            const output = Security.sanitizeCommand(input);
            expect(output).toBe('ls  -la');
        });
        
        test('limits length', () => {
            const input = 'a'.repeat(2000);
            const output = Security.sanitizeCommand(input);
            expect(output.length).toBe(1000);
        });
        
        test('removes javascript: protocol', () => {
            const input = 'echo javascript:alert(1)';
            const output = Security.sanitizeCommand(input);
            expect(output).toBe('echo alert(1)');
        });
    });
    
    describe('validateRegex', () => {
        test('accepts safe regex', () => {
            expect(Security.validateRegex('^test$')).toBe(true);
            expect(Security.validateRegex('[a-z]+')).toBe(true);
        });
        
        test('rejects catastrophic backtracking', () => {
            expect(Security.validateRegex('(a+)+$')).toBe(false);
            expect(Security.validateRegex('(x+x+)+y')).toBe(false);
        });
    });
});
```

#### 9.2 Integration Tests
```javascript
// __tests__/integration.test.js
import puppeteer from 'puppeteer';

describe('Integration Tests', () => {
    let browser;
    let page;
    
    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto('http://localhost:8000');
    });
    
    afterAll(async () => {
        await browser.close();
    });
    
    describe('Security Integration', () => {
        test('XSS prevention in search', async () => {
            // Try to inject script via search
            await page.type('#searchInput', '<script>window.xss=1</script>');
            await page.waitForTimeout(500);
            
            // Check if script executed
            const xss = await page.evaluate(() => window.xss);
            expect(xss).toBeUndefined();
            
            // Check if text is safely displayed
            const suggestionText = await page.$eval(
                '.suggestion-command',
                el => el.textContent
            );
            expect(suggestionText).not.toContain('<script>');
        });
        
        test('XSS prevention in command explainer', async () => {
            // Open command explainer
            await page.keyboard.press('e');
            await page.waitForSelector('#commandInput');
            
            // Try to inject script
            await page.type('#commandInput', 
                'echo "<img src=x onerror=alert(1)>"'
            );
            
            // Check tokens are safely rendered
            const tokenHtml = await page.$eval(
                '.command-token',
                el => el.innerHTML
            );
            expect(tokenHtml).not.toContain('onerror');
        });
    });
    
    describe('Performance Integration', () => {
        test('theme loads within 1 second', async () => {
            const start = Date.now();
            
            // Open theme modal
            await page.click('#themeToggle');
            await page.waitForSelector('.theme-modal');
            
            // Select theme
            await page.click('[data-theme="dracula"]');
            
            // Wait for theme to apply
            await page.waitForFunction(
                () => document.body.classList.contains('dracula'),
                { timeout: 1000 }
            );
            
            const duration = Date.now() - start;
            expect(duration).toBeLessThan(1000);
        });
        
        test('search debouncing works', async () => {
            let searchCount = 0;
            
            // Intercept search requests
            page.on('request', request => {
                if (request.url().includes('search')) {
                    searchCount++;
                }
            });
            
            // Type quickly
            await page.type('#searchInput', 'test', { delay: 50 });
            
            // Wait for debounce
            await page.waitForTimeout(600);
            
            // Should only trigger one search
            expect(searchCount).toBeLessThanOrEqual(1);
        });
    });
});
```

### Day 10: Deployment & Monitoring

#### 10.1 Build Script
```json
// package.json
{
  "scripts": {
    "build": "npm run clean && npm run build:js && npm run build:css && npm run build:html",
    "build:js": "rollup -c rollup.config.js",
    "build:css": "postcss src/styles/**/*.css --dir dist/styles",
    "build:html": "node scripts/build-html.js",
    "clean": "rm -rf dist",
    "test": "jest",
    "test:security": "jest --testPathPattern=security",
    "test:integration": "jest --testPathPattern=integration --runInBand",
    "audit": "npm audit && node scripts/security-audit.js",
    "deploy": "npm run build && npm run test && npm run deploy:gh-pages"
  }
}
```

#### 10.2 Security Audit Script
```javascript
// scripts/security-audit.js
const fs = require('fs').promises;
const path = require('path');

async function auditSecurity() {
    console.log('🔍 Running security audit...\n');
    
    const issues = [];
    
    // Check for innerHTML usage
    const htmlContent = await fs.readFile('index.html', 'utf-8');
    const innerHTMLMatches = htmlContent.match(/\.innerHTML\s*=/g);
    
    if (innerHTMLMatches) {
        issues.push({
            severity: 'HIGH',
            message: `Found ${innerHTMLMatches.length} innerHTML assignments`,
            recommendation: 'Use textContent or safe DOM methods'
        });
    }
    
    // Check for eval usage
    const evalMatches = htmlContent.match(/eval\(/g);
    if (evalMatches) {
        issues.push({
            severity: 'CRITICAL',
            message: 'Found eval() usage',
            recommendation: 'Remove all eval() calls'
        });
    }
    
    // Check dependencies
    try {
        const auditResult = await exec('npm audit --json');
        const audit = JSON.parse(auditResult);
        
        if (audit.metadata.vulnerabilities.high > 0) {
            issues.push({
                severity: 'HIGH',
                message: `${audit.metadata.vulnerabilities.high} high severity vulnerabilities in dependencies`,
                recommendation: 'Run npm audit fix'
            });
        }
    } catch (error) {
        // npm audit returns non-zero exit code if vulnerabilities found
    }
    
    // Report results
    if (issues.length === 0) {
        console.log('✅ No security issues found!');
    } else {
        console.log(`❌ Found ${issues.length} security issues:\n`);
        issues.forEach((issue, index) => {
            console.log(`${index + 1}. [${issue.severity}] ${issue.message}`);
            console.log(`   Recommendation: ${issue.recommendation}\n`);
        });
        process.exit(1);
    }
}

auditSecurity().catch(console.error);
```

#### 10.3 Performance Monitoring
```javascript
// modules/performanceMonitor.js
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoad: 0,
            themeSwitch: [],
            searchTime: [],
            memoryUsage: []
        };
        
        this.init();
    }
    
    init() {
        // Page load time
        if (window.performance && performance.timing) {
            this.metrics.pageLoad = 
                performance.timing.loadEventEnd - 
                performance.timing.navigationStart;
        }
        
        // Monitor memory usage
        if (performance.memory) {
            setInterval(() => {
                this.metrics.memoryUsage.push({
                    timestamp: Date.now(),
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize
                });
                
                // Keep only last hour
                const oneHourAgo = Date.now() - (60 * 60 * 1000);
                this.metrics.memoryUsage = this.metrics.memoryUsage
                    .filter(m => m.timestamp > oneHourAgo);
            }, 60000); // Every minute
        }
    }
    
    measureThemeSwitch(themeName) {
        const start = performance.now();
        
        return () => {
            const duration = performance.now() - start;
            this.metrics.themeSwitch.push({
                theme: themeName,
                duration: duration,
                timestamp: Date.now()
            });
            
            // Alert if too slow
            if (duration > 1000) {
                console.warn(`Theme switch took ${duration}ms`);
            }
        };
    }
    
    measureSearch(query) {
        const start = performance.now();
        
        return (resultCount) => {
            const duration = performance.now() - start;
            this.metrics.searchTime.push({
                query: query,
                results: resultCount,
                duration: duration,
                timestamp: Date.now()
            });
            
            // Alert if too slow
            if (duration > 300) {
                console.warn(`Search took ${duration}ms for "${query}"`);
            }
        };
    }
    
    getReport() {
        const avgSearchTime = this.metrics.searchTime.length > 0
            ? this.metrics.searchTime.reduce((sum, m) => sum + m.duration, 0) / 
              this.metrics.searchTime.length
            : 0;
            
        const avgThemeSwitch = this.metrics.themeSwitch.length > 0
            ? this.metrics.themeSwitch.reduce((sum, m) => sum + m.duration, 0) / 
              this.metrics.themeSwitch.length
            : 0;
            
        const currentMemory = this.metrics.memoryUsage.length > 0
            ? this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1]
            : null;
            
        return {
            pageLoadTime: this.metrics.pageLoad,
            averageSearchTime: Math.round(avgSearchTime),
            averageThemeSwitchTime: Math.round(avgThemeSwitch),
            currentMemoryUsage: currentMemory ? 
                Math.round(currentMemory.used / 1024 / 1024) + 'MB' : 'N/A',
            totalSearches: this.metrics.searchTime.length,
            totalThemeSwitches: this.metrics.themeSwitch.length
        };
    }
    
    sendToAnalytics() {
        const report = this.getReport();
        
        // Send to analytics service (privacy-friendly)
        if (window.analytics) {
            window.analytics.track('performance_metrics', report);
        }
    }
}

// Export singleton
export const performanceMonitor = new PerformanceMonitor();
```

## Rollback Plan

In case any critical implementation causes issues:

### 1. Feature Flags
```javascript
// config/featureFlags.js
export const features = {
    secureRendering: true,
    lazyThemeLoading: true,
    virtualScrolling: false, // Start disabled
    advancedSearch: false
};

// Usage
if (features.secureRendering) {
    element.textContent = data; // Safe
} else {
    element.innerHTML = data; // Old way (for rollback)
}
```

### 2. Version Control
```bash
# Tag before changes
git tag -a v1.0.0-pre-security -m "Before security updates"

# Create branches for each phase
git checkout -b security-fixes
git checkout -b performance-optimization
git checkout -b integration

# Merge progressively
git checkout main
git merge security-fixes --no-ff
# Test in production
# If good, continue...
git merge performance-optimization --no-ff
```

### 3. Monitoring & Alerts
```javascript
// Monitor for regressions
window.addEventListener('error', (event) => {
    // Check if error is related to new code
    if (event.error && event.error.stack.includes('security.js')) {
        // Rollback to unsafe but working version
        console.error('Security module error, using fallback');
        window.Security = {
            escapeHtml: (str) => str, // Unsafe but won't break
            // ... other fallbacks
        };
    }
});
```

## Success Metrics

- **Security**: 0 XSS vulnerabilities in OWASP ZAP scan
- **Performance**: 
  - Theme load < 500ms
  - Search response < 100ms
  - Memory usage stable (no growth over time)
- **Code Quality**: 
  - 100% of innerHTML replaced
  - 0 ESLint security warnings
  - All tests passing
- **User Impact**: 
  - No increase in error rates
  - No degradation in load times
  - Positive user feedback