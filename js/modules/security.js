/**
 * Security Module for Linux Man Pages
 * Provides utilities for safe HTML rendering and input validation
 */

const Security = {
    /**
     * Escape HTML entities to prevent XSS
     * @param {string} unsafe - Untrusted input string
     * @returns {string} Safe HTML-escaped string
     */
    escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') {
            return '';
        }
        const div = document.createElement('div');
        div.textContent = unsafe;
        return div.innerHTML;
    },

    /**
     * Sanitize command input
     * @param {string} input - User command input
     * @returns {string} Sanitized command string
     */
    sanitizeCommand(input) {
        if (typeof input !== 'string') {
            return '';
        }
        // Remove potential script injections
        return input
            .replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .substring(0, 1000); // Limit length
    },

    /**
     * Validate regex patterns to prevent ReDoS
     * @param {string} pattern - Regex pattern to validate
     * @returns {boolean} True if pattern is safe
     */
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

    /**
     * Create a text node safely
     * @param {string} text - Text content
     * @returns {Text} Safe text node
     */
    createTextNode(text) {
        return document.createTextNode(text || '');
    },

    /**
     * Create element with safe text content
     * @param {string} tag - HTML tag name
     * @param {string} text - Text content
     * @param {string} className - Optional CSS class
     * @returns {HTMLElement} Safe element
     */
    createElement(tag, text, className) {
        const element = document.createElement(tag);
        if (text) {
            element.textContent = text;
        }
        if (className) {
            element.className = className;
        }
        return element;
    },

    /**
     * Safe alternative to innerHTML for complex structures
     * @param {HTMLElement} container - Container element
     * @param {Function} builder - Function that builds DOM structure
     */
    safeRender(container, builder) {
        // Clear container safely
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        
        // Build new content
        const fragment = document.createDocumentFragment();
        builder(fragment);
        container.appendChild(fragment);
    },

    /**
     * Validate and sanitize data from localStorage
     * @param {string} key - Storage key
     * @returns {*} Parsed and validated data
     */
    getFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            if (!data) return null;
            
            const parsed = JSON.parse(data);
            
            // Validate structure based on key
            switch (key) {
                case 'manPageHistory':
                case 'manPageBookmarks':
                    if (!Array.isArray(parsed)) return [];
                    // Sanitize each entry
                    return parsed.map(entry => ({
                        command: this.sanitizeCommand(entry.command || ''),
                        section: parseInt(entry.section) || 1,
                        timestamp: parseInt(entry.timestamp) || Date.now()
                    }));
                
                case 'selectedTheme':
                    // Whitelist valid theme names
                    const validThemes = [
                        'default', 'dark', 'solarized-dark', 'solarized-light',
                        'monokai', 'dracula', 'nord', 'gruvbox', 'material',
                        'one-dark', 'cyberpunk', 'ocean-depth', 'forest-night',
                        'sunset', 'midnight-blue', 'high-contrast'
                    ];
                    return validThemes.includes(parsed) ? parsed : 'ocean-depth';
                
                default:
                    return parsed;
            }
        } catch (e) {
            console.error(`Failed to parse storage key ${key}:`, e);
            return null;
        }
    },

    /**
     * Safely save data to localStorage
     * @param {string} key - Storage key
     * @param {*} data - Data to store
     */
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`Failed to save to storage key ${key}:`, e);
        }
    },

    /**
     * Validate command name format
     * @param {string} command - Command name
     * @returns {boolean} True if valid
     */
    isValidCommand(command) {
        // Allow alphanumeric, dash, underscore, dot
        const commandRegex = /^[a-zA-Z0-9\-_.]+$/;
        return commandRegex.test(command) && command.length <= 100;
    },

    /**
     * Validate section number
     * @param {number|string} section - Section number
     * @returns {boolean} True if valid
     */
    isValidSection(section) {
        const num = parseInt(section);
        return !isNaN(num) && num >= 1 && num <= 9;
    },

    /**
     * Create a safe suggestion element
     * @param {Object} result - Search result object
     * @param {number} index - Result index
     * @returns {HTMLElement} Safe suggestion element
     */
    createSuggestionElement(result, index) {
        const suggestion = document.createElement('div');
        suggestion.className = 'suggestion';
        suggestion.dataset.index = index;
        
        // Create info container
        const info = document.createElement('div');
        info.className = 'suggestion-info';
        
        // Command name (sanitized)
        const command = document.createElement('div');
        command.className = 'suggestion-command';
        command.textContent = this.sanitizeCommand(result.command || '');
        
        // Description (sanitized)
        const desc = document.createElement('div');
        desc.className = 'suggestion-desc';
        desc.textContent = result.description || 'No description available';
        
        // Section badge
        const badge = document.createElement('span');
        badge.className = 'section-badge';
        
        if (result.sections && result.sections.length > 1) {
            const sections = result.sections
                .filter(s => this.isValidSection(s))
                .sort((a, b) => a - b)
                .join(', ');
            badge.textContent = `Sections ${sections}`;
        } else {
            badge.textContent = `Section ${this.isValidSection(result.section) ? result.section : '1'}`;
        }
        
        // Assemble structure
        info.appendChild(command);
        info.appendChild(desc);
        suggestion.appendChild(info);
        suggestion.appendChild(badge);
        
        return suggestion;
    },

    /**
     * Create a safe history/bookmark item
     * @param {Object} item - History/bookmark item
     * @param {string} type - 'history' or 'bookmark'
     * @returns {HTMLElement} Safe item element
     */
    createListItem(item, type) {
        const div = document.createElement('div');
        div.className = type === 'history' ? 'history-item' : 'bookmark-item';
        
        // Command link
        const link = document.createElement('a');
        link.href = '#';
        link.className = type === 'history' ? 'history-link' : 'bookmark-link';
        link.textContent = this.sanitizeCommand(item.command || 'Unknown');
        
        // Section badge
        const section = document.createElement('span');
        section.className = 'section-indicator';
        section.textContent = `(${this.isValidSection(item.section) ? item.section : '1'})`;
        
        // Timestamp (history only)
        if (type === 'history' && item.timestamp) {
            const time = document.createElement('span');
            time.className = 'history-time';
            const date = new Date(parseInt(item.timestamp) || Date.now());
            time.textContent = date.toLocaleTimeString();
            div.appendChild(time);
        }
        
        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = type === 'history' ? 'remove-history' : 'remove-bookmark';
        removeBtn.textContent = '×';
        removeBtn.setAttribute('aria-label', `Remove ${type}`);
        
        div.appendChild(link);
        div.appendChild(section);
        div.appendChild(removeBtn);
        
        return div;
    },

    /**
     * Safely render man page content
     * @param {string} content - Raw man page content
     * @returns {DocumentFragment} Safe content fragment
     */
    renderManPageContent(content) {
        const fragment = document.createDocumentFragment();
        const lines = content.split('\n');
        
        lines.forEach(line => {
            const div = document.createElement('div');
            
            // Detect section headers (all caps)
            if (/^[A-Z][A-Z\s]+$/.test(line.trim()) && line.trim().length > 2) {
                div.className = 'section-header';
                div.textContent = line;
            } else {
                // For now, just render as text
                // TODO: Parse man page formatting codes safely
                div.textContent = line;
            }
            
            fragment.appendChild(div);
        });
        
        return fragment;
    }
};

// Export as default to avoid potential issues
export default Security;
export { Security };