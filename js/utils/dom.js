/**
 * DOM Utilities
 * Helper functions for DOM manipulation
 */

export const DOM = {
    /**
     * Query selector with error handling
     * @param {string} selector - CSS selector
     * @param {Element} parent - Parent element (default: document)
     * @returns {Element|null} Found element or null
     */
    $(selector, parent = document) {
        try {
            return parent.querySelector(selector);
        } catch (e) {
            console.error(`Invalid selector: ${selector}`, e);
            return null;
        }
    },

    /**
     * Query selector all with error handling
     * @param {string} selector - CSS selector
     * @param {Element} parent - Parent element (default: document)
     * @returns {NodeList} Found elements
     */
    $$(selector, parent = document) {
        try {
            return parent.querySelectorAll(selector);
        } catch (e) {
            console.error(`Invalid selector: ${selector}`, e);
            return [];
        }
    },

    /**
     * Create element with optional attributes and content
     * @param {string} tag - HTML tag name
     * @param {Object} attrs - Attributes to set
     * @param {string|Element|Array} content - Content to append
     * @returns {Element} Created element
     */
    create(tag, attrs = {}, content = null) {
        const element = document.createElement(tag);
        
        // Set attributes
        for (const [key, value] of Object.entries(attrs)) {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else if (key.startsWith('data')) {
                element.dataset[key.substring(4).toLowerCase()] = value;
            } else {
                element.setAttribute(key, value);
            }
        }
        
        // Add content
        if (content) {
            this.append(element, content);
        }
        
        return element;
    },

    /**
     * Append content to element
     * @param {Element} parent - Parent element
     * @param {string|Element|Array} content - Content to append
     */
    append(parent, content) {
        if (!parent || !content) return;
        
        if (typeof content === 'string') {
            parent.appendChild(document.createTextNode(content));
        } else if (content instanceof Element) {
            parent.appendChild(content);
        } else if (Array.isArray(content)) {
            content.forEach(item => this.append(parent, item));
        }
    },

    /**
     * Clear element content safely
     * @param {Element} element - Element to clear
     */
    clear(element) {
        if (!element) return;
        
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },

    /**
     * Add event listener with automatic cleanup
     * @param {Element} element - Target element
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     * @returns {Function} Cleanup function
     */
    on(element, event, handler, options = {}) {
        if (!element || !event || !handler) return () => {};
        
        element.addEventListener(event, handler, options);
        
        // Return cleanup function
        return () => {
            element.removeEventListener(event, handler, options);
        };
    },

    /**
     * Add delegated event listener
     * @param {Element} parent - Parent element
     * @param {string} selector - Child selector
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     * @returns {Function} Cleanup function
     */
    delegate(parent, selector, event, handler) {
        const delegatedHandler = (e) => {
            const target = e.target.closest(selector);
            if (target && parent.contains(target)) {
                handler.call(target, e);
            }
        };
        
        return this.on(parent, event, delegatedHandler);
    },

    /**
     * Show element
     * @param {Element} element - Element to show
     * @param {string} display - Display value (default: 'block')
     */
    show(element, display = 'block') {
        if (element) {
            element.style.display = display;
        }
    },

    /**
     * Hide element
     * @param {Element} element - Element to hide
     */
    hide(element) {
        if (element) {
            element.style.display = 'none';
        }
    },

    /**
     * Toggle element visibility
     * @param {Element} element - Element to toggle
     * @param {boolean} force - Force show/hide
     */
    toggle(element, force) {
        if (!element) return;
        
        if (force !== undefined) {
            element.style.display = force ? 'block' : 'none';
        } else {
            element.style.display = element.style.display === 'none' ? 'block' : 'none';
        }
    },

    /**
     * Add CSS class
     * @param {Element} element - Target element
     * @param {string|Array} className - Class name(s) to add
     */
    addClass(element, className) {
        if (!element) return;
        
        if (Array.isArray(className)) {
            element.classList.add(...className);
        } else {
            element.classList.add(className);
        }
    },

    /**
     * Remove CSS class
     * @param {Element} element - Target element
     * @param {string|Array} className - Class name(s) to remove
     */
    removeClass(element, className) {
        if (!element) return;
        
        if (Array.isArray(className)) {
            element.classList.remove(...className);
        } else {
            element.classList.remove(className);
        }
    },

    /**
     * Toggle CSS class
     * @param {Element} element - Target element
     * @param {string} className - Class name to toggle
     * @param {boolean} force - Force add/remove
     */
    toggleClass(element, className, force) {
        if (!element) return;
        
        element.classList.toggle(className, force);
    },

    /**
     * Check if element has class
     * @param {Element} element - Target element
     * @param {string} className - Class name to check
     * @returns {boolean} True if has class
     */
    hasClass(element, className) {
        return element ? element.classList.contains(className) : false;
    },

    /**
     * Set element attributes
     * @param {Element} element - Target element
     * @param {Object} attrs - Attributes to set
     */
    setAttrs(element, attrs) {
        if (!element || !attrs) return;
        
        for (const [key, value] of Object.entries(attrs)) {
            element.setAttribute(key, value);
        }
    },

    /**
     * Get element offset relative to document
     * @param {Element} element - Target element
     * @returns {Object} Offset object with top and left
     */
    offset(element) {
        if (!element) return { top: 0, left: 0 };
        
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX
        };
    },

    /**
     * Scroll element into view
     * @param {Element} element - Element to scroll to
     * @param {Object} options - Scroll options
     */
    scrollIntoView(element, options = {}) {
        if (!element) return;
        
        const defaultOptions = {
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        };
        
        element.scrollIntoView({ ...defaultOptions, ...options });
    },

    /**
     * Animate element
     * @param {Element} element - Element to animate
     * @param {Object} keyframes - Animation keyframes
     * @param {Object} options - Animation options
     * @returns {Animation} Animation object
     */
    animate(element, keyframes, options = {}) {
        if (!element || !element.animate) return null;
        
        const defaultOptions = {
            duration: 300,
            easing: 'ease-in-out',
            fill: 'forwards'
        };
        
        return element.animate(keyframes, { ...defaultOptions, ...options });
    },

    /**
     * Wait for element to appear
     * @param {string} selector - CSS selector
     * @param {number} timeout - Timeout in ms (default: 5000)
     * @returns {Promise<Element>} Promise resolving to element
     */
    waitFor(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = this.$(selector);
            if (element) {
                resolve(element);
                return;
            }
            
            const observer = new MutationObserver((mutations, obs) => {
                const element = this.$(selector);
                if (element) {
                    obs.disconnect();
                    resolve(element);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    },

    /**
     * Create DocumentFragment from HTML string
     * @param {string} html - HTML string
     * @returns {DocumentFragment} Document fragment
     */
    fragment(html) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content;
    },

    /**
     * Measure element dimensions
     * @param {Element} element - Element to measure
     * @returns {Object} Dimensions object
     */
    measure(element) {
        if (!element) return { width: 0, height: 0 };
        
        const rect = element.getBoundingClientRect();
        return {
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left,
            bottom: rect.bottom,
            right: rect.right
        };
    }
};