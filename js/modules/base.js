/**
 * Base Module
 * Abstract base class for all modules
 */

export class BaseModule {
    constructor(name) {
        this.name = name;
        this.initialized = false;
        this.eventListeners = [];
        this.cleanupFunctions = [];
    }

    /**
     * Initialize the module
     * Override in subclasses
     */
    async init() {
        if (this.initialized) {
            console.warn(`Module ${this.name} already initialized`);
            return;
        }
        
        console.log(`Initializing ${this.name} module...`);
        
        try {
            // Setup event listeners
            await this.setupEventListeners();
            
            // Module-specific initialization
            await this.onInit();
            
            this.initialized = true;
            console.log(`${this.name} module initialized successfully`);
        } catch (error) {
            console.error(`Failed to initialize ${this.name} module:`, error);
            throw error;
        }
    }

    /**
     * Module-specific initialization
     * Override in subclasses
     */
    async onInit() {
        // Override in subclasses
    }

    /**
     * Setup event listeners
     * Override in subclasses
     */
    async setupEventListeners() {
        // Override in subclasses
    }

    /**
     * Add event listener with automatic cleanup
     * @param {EventTarget} target - Event target
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     */
    addEventListener(target, event, handler, options = {}) {
        target.addEventListener(event, handler, options);
        
        // Store for cleanup
        this.eventListeners.push({
            target,
            event,
            handler,
            options
        });
    }

    /**
     * Add cleanup function
     * @param {Function} cleanupFn - Cleanup function
     */
    addCleanup(cleanupFn) {
        if (typeof cleanupFn === 'function') {
            this.cleanupFunctions.push(cleanupFn);
        }
    }

    /**
     * Remove all event listeners
     */
    removeEventListeners() {
        this.eventListeners.forEach(({ target, event, handler, options }) => {
            target.removeEventListener(event, handler, options);
        });
        this.eventListeners = [];
    }

    /**
     * Destroy the module
     */
    destroy() {
        console.log(`Destroying ${this.name} module...`);
        
        // Remove event listeners
        this.removeEventListeners();
        
        // Run cleanup functions
        this.cleanupFunctions.forEach(fn => {
            try {
                fn();
            } catch (error) {
                console.error(`Cleanup error in ${this.name}:`, error);
            }
        });
        this.cleanupFunctions = [];
        
        // Module-specific cleanup
        this.onDestroy();
        
        this.initialized = false;
        console.log(`${this.name} module destroyed`);
    }

    /**
     * Module-specific cleanup
     * Override in subclasses
     */
    onDestroy() {
        // Override in subclasses
    }

    /**
     * Check if module is initialized
     * @returns {boolean} True if initialized
     */
    isInitialized() {
        return this.initialized;
    }

    /**
     * Emit custom event
     * @param {string} eventName - Event name
     * @param {*} detail - Event detail
     * @param {EventTarget} target - Event target (default: document)
     */
    emit(eventName, detail = null, target = document) {
        const event = new CustomEvent(`${this.name}:${eventName}`, {
            detail,
            bubbles: true,
            cancelable: true
        });
        target.dispatchEvent(event);
    }

    /**
     * Listen for custom event
     * @param {string} eventName - Event name
     * @param {Function} handler - Event handler
     * @param {EventTarget} target - Event target (default: document)
     */
    on(eventName, handler, target = document) {
        const fullEventName = eventName.includes(':') ? eventName : `${this.name}:${eventName}`;
        this.addEventListener(target, fullEventName, handler);
    }

    /**
     * Show error message
     * @param {string} message - Error message
     * @param {Error} error - Error object
     */
    showError(message, error = null) {
        console.error(`[${this.name}] ${message}`, error);
        
        // Emit error event
        this.emit('error', {
            message,
            error,
            module: this.name
        });
    }

    /**
     * Show status message
     * @param {string} message - Status message
     * @param {string} type - Message type (info, success, warning, error)
     */
    showStatus(message, type = 'info') {
        console.log(`[${this.name}] ${message}`);
        
        // Emit status event
        this.emit('status', {
            message,
            type,
            module: this.name
        });
    }

    /**
     * Wait for condition
     * @param {Function} condition - Condition function
     * @param {number} timeout - Timeout in ms
     * @param {number} interval - Check interval in ms
     * @returns {Promise} Promise that resolves when condition is met
     */
    waitFor(condition, timeout = 5000, interval = 100) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            const check = () => {
                if (condition()) {
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Timeout waiting for condition in ${this.name}`));
                } else {
                    setTimeout(check, interval);
                }
            };
            
            check();
        });
    }
}