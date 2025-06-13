/**
 * Main Application Entry Point
 * Orchestrates all modules and initializes the application
 */

// Import modules
import { Storage } from './modules/storage.js';
import { Theme } from './modules/theme.js';
import { Security } from './modules/security.js';

// Import utilities
import { DOM } from './utils/dom.js';
import { APP_CONSTANTS } from './utils/constants.js';

class LinuxManPagesApp {
    constructor() {
        this.modules = {
            storage: Storage,
            theme: Theme,
            security: Security
        };
        
        this.initialized = false;
        this.state = {
            currentPage: 'search',
            currentManPage: null,
            searchActive: false
        };
    }

    /**
     * Initialize the application
     */
    async init() {
        if (this.initialized) {
            console.warn('Application already initialized');
            return;
        }
        
        console.log('Initializing Linux Man Pages application...');
        
        try {
            // Show loading state
            this.showLoadingState();
            
            // Initialize modules in order
            await this.initializeModules();
            
            // Setup global event listeners
            this.setupGlobalListeners();
            
            // Load initial data
            await this.loadInitialData();
            
            // Hide loading state
            this.hideLoadingState();
            
            this.initialized = true;
            console.log('Application initialized successfully');
            
            // Emit ready event
            this.emit('app:ready');
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('Failed to initialize application. Please refresh the page.');
        }
    }

    /**
     * Initialize all modules
     */
    async initializeModules() {
        // Initialize storage first (other modules depend on it)
        await this.initModule('storage');
        
        // Initialize theme module
        await this.initModule('theme');
        
        // Note: Other modules will be initialized as they are created
        // await this.initModule('search');
        // await this.initModule('navigation');
        // etc.
    }

    /**
     * Initialize a single module
     * @param {string} moduleName - Name of the module to initialize
     */
    async initModule(moduleName) {
        const module = this.modules[moduleName];
        if (!module) {
            throw new Error(`Module ${moduleName} not found`);
        }
        
        if (module.init) {
            await module.init();
        }
    }

    /**
     * Setup global event listeners
     */
    setupGlobalListeners() {
        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.emit('app:resize');
            }, 250);
        });
        
        // Handle online/offline
        window.addEventListener('online', () => {
            this.emit('app:online');
            this.showStatus('Connection restored', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.emit('app:offline');
            this.showStatus('Working offline', 'warning');
        });
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.emit('app:hidden');
            } else {
                this.emit('app:visible');
            }
        });
        
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.emit('app:error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                error: event.error
            });
        });
        
        // Unhandled promise rejection
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.emit('app:unhandledRejection', {
                reason: event.reason,
                promise: event.promise
            });
        });
    }

    /**
     * Load initial data
     */
    async loadInitialData() {
        // This will be expanded as modules are added
        // For now, just ensure DOM is ready
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        const container = DOM.$('#container');
        if (container) {
            DOM.addClass(container, 'loading');
        }
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        const container = DOM.$('#container');
        if (container) {
            DOM.removeClass(container, 'loading');
        }
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        // This will be replaced with proper UI notification
        console.error(message);
        
        // For now, use alert as fallback
        const status = DOM.$('#status');
        if (status) {
            status.textContent = message;
            DOM.show(status);
            setTimeout(() => DOM.hide(status), 5000);
        } else {
            alert(message);
        }
    }

    /**
     * Show status message
     * @param {string} message - Status message
     * @param {string} type - Message type
     */
    showStatus(message, type = 'info') {
        const status = DOM.$('#status');
        if (status) {
            status.textContent = message;
            status.className = `status status-${type}`;
            DOM.show(status);
            setTimeout(() => DOM.hide(status), APP_CONSTANTS.STATUS_DURATION);
        }
    }

    /**
     * Emit custom event
     * @param {string} eventName - Event name
     * @param {*} detail - Event detail
     */
    emit(eventName, detail = null) {
        const event = new CustomEvent(eventName, {
            detail,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
    }

    /**
     * Get current state
     * @returns {Object} Current application state
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Update state
     * @param {Object} updates - State updates
     */
    setState(updates) {
        const oldState = { ...this.state };
        this.state = { ...this.state, ...updates };
        
        this.emit('app:stateChange', {
            oldState,
            newState: this.state,
            changes: updates
        });
    }

    /**
     * Get module instance
     * @param {string} moduleName - Module name
     * @returns {Object} Module instance
     */
    getModule(moduleName) {
        return this.modules[moduleName];
    }

    /**
     * Register new module
     * @param {string} name - Module name
     * @param {Object} module - Module instance
     */
    registerModule(name, module) {
        this.modules[name] = module;
    }

    /**
     * Destroy the application
     */
    destroy() {
        console.log('Destroying application...');
        
        // Destroy all modules
        Object.values(this.modules).forEach(module => {
            if (module.destroy) {
                module.destroy();
            }
        });
        
        // Clear state
        this.state = {};
        this.initialized = false;
        
        console.log('Application destroyed');
    }
}

// Create and export application instance
const app = new LinuxManPagesApp();

// Don't auto-initialize for now - let index.html handle it
console.log('App module loaded, not auto-initializing');

// Export for use in other modules
export default app;

// Also expose on window for debugging
window.app = app;