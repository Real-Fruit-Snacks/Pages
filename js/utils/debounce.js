/**
 * Debounce and Throttle Utilities
 * Performance optimization functions
 */

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute on leading edge
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300, immediate = false) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func.apply(this, args);
    };
}

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, wait = 300) {
    let inThrottle;
    
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            
            setTimeout(() => {
                inThrottle = false;
            }, wait);
        }
    };
}

/**
 * Progressive debounce with variable delay
 * @param {Function} func - Function to debounce
 * @param {number} minWait - Minimum wait time
 * @param {number} maxWait - Maximum wait time
 * @param {Function} getDelay - Function to calculate delay
 * @returns {Function} Debounced function
 */
export function progressiveDebounce(func, minWait = 100, maxWait = 500, getDelay = null) {
    let timeout;
    
    return function executedFunction(...args) {
        const input = args[0];
        
        // Calculate delay based on input
        let wait = maxWait;
        if (getDelay) {
            wait = getDelay(input);
        } else if (typeof input === 'string') {
            // Default: shorter delay for longer inputs
            const inputLength = input.length;
            wait = Math.max(minWait, maxWait - (inputLength * 50));
        }
        
        wait = Math.min(Math.max(wait, minWait), maxWait);
        
        const later = () => {
            timeout = null;
            func.apply(this, args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Request animation frame throttle
 * @param {Function} func - Function to throttle
 * @returns {Function} Throttled function
 */
export function rafThrottle(func) {
    let rafId;
    
    return function executedFunction(...args) {
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
        
        rafId = requestAnimationFrame(() => {
            func.apply(this, args);
        });
    };
}

/**
 * Async debounce for promises
 * @param {Function} func - Async function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced async function
 */
export function debounceAsync(func, wait = 300) {
    let timeout;
    let resolvePromise;
    
    return function executedFunction(...args) {
        return new Promise((resolve, reject) => {
            const later = async () => {
                timeout = null;
                try {
                    const result = await func.apply(this, args);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };
            
            clearTimeout(timeout);
            
            if (resolvePromise) {
                resolvePromise(new Error('Debounced'));
            }
            
            resolvePromise = resolve;
            timeout = setTimeout(later, wait);
        });
    };
}

/**
 * Leading and trailing debounce
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounceLeadingTrailing(func, wait = 300) {
    let timeout;
    let lastCallTime;
    
    return function executedFunction(...args) {
        const now = Date.now();
        
        if (!lastCallTime || now - lastCallTime >= wait) {
            // Leading edge
            func.apply(this, args);
            lastCallTime = now;
        }
        
        // Trailing edge
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const timeSinceLastCall = Date.now() - lastCallTime;
            if (timeSinceLastCall >= wait) {
                func.apply(this, args);
                lastCallTime = Date.now();
            }
        }, wait);
    };
}

/**
 * Create a cancelable debounced function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Object} Object with debounced function and cancel method
 */
export function cancelableDebounce(func, wait = 300) {
    let timeout;
    
    const debounced = function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
    
    debounced.cancel = () => {
        clearTimeout(timeout);
    };
    
    debounced.flush = function(...args) {
        clearTimeout(timeout);
        func.apply(this, args);
    };
    
    return debounced;
}