/**
 * Storage Module
 * Handles all localStorage operations with validation and error handling
 */

// Note: Security import removed to avoid circular dependency

class StorageModule {
    constructor() {
        this.STORAGE_KEYS = {
            HISTORY: 'manPageHistory',
            BOOKMARKS: 'manPageBookmarks',
            THEME: 'selectedTheme'
        };
        
        this.MAX_HISTORY_ITEMS = 50;
    }

    /**
     * Initialize storage module
     */
    init() {
        // Ensure storage is available
        if (!this.isStorageAvailable()) {
            console.warn('localStorage is not available');
        }
    }

    /**
     * Check if localStorage is available
     * @returns {boolean} True if localStorage is available
     */
    isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Get data from storage with validation
     * @param {string} key - Storage key
     * @returns {*} Parsed and validated data
     */
    get(key) {
        if (!this.isStorageAvailable()) return null;
        
        try {
            const data = localStorage.getItem(key);
            if (!data) return null;
            
            // Parse and validate JSON data
            if (key === this.STORAGE_KEYS.HISTORY || key === this.STORAGE_KEYS.BOOKMARKS) {
                const parsed = JSON.parse(data);
                return Array.isArray(parsed) ? parsed : [];
            }
            
            return JSON.parse(data);
        } catch (e) {
            console.error(`Failed to get data from storage key ${key}:`, e);
            return null;
        }
    }

    /**
     * Save data to storage
     * @param {string} key - Storage key
     * @param {*} data - Data to save
     */
    set(key, data) {
        if (!this.isStorageAvailable()) return;
        
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`Failed to save data to storage key ${key}:`, e);
            
            // Handle quota exceeded
            if (e.name === 'QuotaExceededError') {
                this.handleQuotaExceeded(key);
            }
        }
    }

    /**
     * Remove item from storage
     * @param {string} key - Storage key
     */
    remove(key) {
        if (!this.isStorageAvailable()) return;
        
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error(`Failed to remove storage key ${key}:`, e);
        }
    }

    /**
     * Clear all storage
     */
    clear() {
        if (!this.isStorageAvailable()) return;
        
        try {
            localStorage.clear();
        } catch (e) {
            console.error('Failed to clear storage:', e);
        }
    }

    /**
     * Get history items
     * @returns {Array} History items
     */
    getHistory() {
        return this.get(this.STORAGE_KEYS.HISTORY) || [];
    }

    /**
     * Save history items
     * @param {Array} history - History items to save
     */
    saveHistory(history) {
        // Limit history size
        const limited = history.slice(0, this.MAX_HISTORY_ITEMS);
        this.set(this.STORAGE_KEYS.HISTORY, limited);
    }

    /**
     * Add item to history
     * @param {Object} item - History item to add
     */
    addToHistory(item) {
        const history = this.getHistory();
        
        // Remove duplicate if exists
        const existingIndex = history.findIndex(h => 
            h.command === item.command && h.section === item.section
        );
        if (existingIndex >= 0) {
            history.splice(existingIndex, 1);
        }
        
        // Add to beginning
        history.unshift({
            ...item,
            timestamp: Date.now()
        });
        
        this.saveHistory(history);
        return history;
    }

    /**
     * Get bookmarks
     * @returns {Array} Bookmark items
     */
    getBookmarks() {
        return this.get(this.STORAGE_KEYS.BOOKMARKS) || [];
    }

    /**
     * Save bookmarks
     * @param {Array} bookmarks - Bookmarks to save
     */
    saveBookmarks(bookmarks) {
        this.set(this.STORAGE_KEYS.BOOKMARKS, bookmarks);
    }

    /**
     * Add bookmark
     * @param {Object} bookmark - Bookmark to add
     * @returns {boolean} True if added, false if already exists
     */
    addBookmark(bookmark) {
        const bookmarks = this.getBookmarks();
        
        // Check if already exists
        const exists = bookmarks.some(b => 
            b.command === bookmark.command && b.section === bookmark.section
        );
        
        if (!exists) {
            bookmarks.push({
                ...bookmark,
                timestamp: Date.now()
            });
            this.saveBookmarks(bookmarks);
            return true;
        }
        
        return false;
    }

    /**
     * Remove bookmark
     * @param {string} command - Command name
     * @param {number} section - Section number
     * @returns {boolean} True if removed
     */
    removeBookmark(command, section) {
        const bookmarks = this.getBookmarks();
        const index = bookmarks.findIndex(b => 
            b.command === command && b.section === section
        );
        
        if (index >= 0) {
            bookmarks.splice(index, 1);
            this.saveBookmarks(bookmarks);
            return true;
        }
        
        return false;
    }

    /**
     * Get theme preference
     * @returns {string} Theme name
     */
    getTheme() {
        return this.get(this.STORAGE_KEYS.THEME) || 'ocean-depth';
    }

    /**
     * Save theme preference
     * @param {string} theme - Theme name
     */
    saveTheme(theme) {
        this.set(this.STORAGE_KEYS.THEME, theme);
    }

    /**
     * Handle quota exceeded error
     * @param {string} key - Storage key that caused the error
     */
    handleQuotaExceeded(key) {
        console.warn('Storage quota exceeded, attempting cleanup...');
        
        // Try to clean up old history items
        if (key === this.STORAGE_KEYS.HISTORY) {
            const history = this.getHistory();
            if (history.length > 25) {
                this.saveHistory(history.slice(0, 25));
            }
        }
    }

    /**
     * Get storage size info
     * @returns {Object} Storage size information
     */
    getStorageInfo() {
        if (!this.isStorageAvailable()) {
            return { used: 0, total: 0, percentage: 0 };
        }
        
        let used = 0;
        
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                used += localStorage[key].length + key.length;
            }
        }
        
        // Estimate total (5MB typical limit)
        const total = 5 * 1024 * 1024;
        const percentage = (used / total * 100).toFixed(2);
        
        return {
            used: used,
            total: total,
            percentage: percentage,
            usedMB: (used / 1024 / 1024).toFixed(2),
            totalMB: (total / 1024 / 1024).toFixed(2)
        };
    }
}

// Export singleton instance
export const Storage = new StorageModule();