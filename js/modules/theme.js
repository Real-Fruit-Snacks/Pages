/**
 * Theme Module
 * Handles theme switching and loading
 */

import { Storage } from './storage.js';

class ThemeModule {
    constructor() {
        this.themes = [
            { name: 'Cyber Frost', class: 'cyber-frost', icon: '❄️' },
            { name: 'Dark', class: 'dark-mode', icon: '🌙' },
            { name: 'Dracula', class: 'dracula', icon: '🧛' },
            { name: 'Forest Dawn', class: 'forest-dawn', icon: '🌲' },
            { name: 'Gruvbox', class: 'gruvbox', icon: '🍂' },
            { name: 'High Contrast', class: 'high-contrast', icon: '⚡' },
            { name: 'Light', class: '', icon: '☀️' },
            { name: 'Miami Sunrise', class: 'miami-sunrise', icon: '🌺' },
            { name: 'Monokai', class: 'monokai', icon: '🎨' },
            { name: 'Neon Noir', class: 'neon-noir', icon: '🌆' },
            { name: 'Nord', class: 'nord', icon: '🏔️' },
            { name: 'Ocean Depth', class: 'ocean-depth', icon: '🌊' },
            { name: 'One Dark', class: 'one-dark', icon: '🌑' },
            { name: 'Retro Wave', class: 'retro-wave', icon: '🌴' },
            { name: 'Solarized', class: 'solarized-dark', icon: '🌅' },
            { name: 'Tokyo Night', class: 'tokyo-night', icon: '🌃' }
        ];
        
        this.currentThemeIndex = 11; // Ocean Depth as default
        this.themeToggleBtn = null;
        this.themeIcon = null;
        this.themeModal = null;
        this.themeModalClose = null;
        this.themeOptions = null;
    }

    /**
     * Initialize theme module
     */
    init() {
        console.log('Initializing Theme module...');
        
        // Get UI elements
        this.themeToggleBtn = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggleBtn ? this.themeToggleBtn.querySelector('.theme-icon') : null;
        this.themeModal = document.getElementById('themeModal');
        this.themeModalClose = document.getElementById('themeModalClose');
        this.themeOptions = document.getElementById('themeOptions');
        
        if (!this.themeToggleBtn) {
            console.error('Theme toggle button not found');
            return;
        }
        
        // Load saved theme
        this.loadSavedTheme();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('Theme module initialized');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Theme toggle button
        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => {
                this.openThemeModal();
            });
        }
        
        // Theme modal close button
        if (this.themeModalClose) {
            this.themeModalClose.addEventListener('click', () => {
                this.closeThemeModal();
            });
        }
        
        // Close modal on overlay click
        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.closeThemeModal();
            });
        }
    }

    /**
     * Load saved theme or apply default
     */
    loadSavedTheme() {
        const savedTheme = Storage.get('selectedTheme', '');
        if (savedTheme) {
            const themeIndex = this.themes.findIndex(t => t.class === savedTheme);
            if (themeIndex !== -1) {
                this.currentThemeIndex = themeIndex;
                this.applyTheme(this.currentThemeIndex);
            } else {
                // Saved theme not found, apply default
                this.applyTheme(this.currentThemeIndex);
            }
        } else {
            // No saved theme, apply default
            this.applyTheme(this.currentThemeIndex);
        }
    }

    /**
     * Apply theme by index
     * @param {number} index - Theme index
     */
    applyTheme(index) {
        // Remove all theme classes
        this.themes.forEach(theme => {
            if (theme.class) {
                document.body.classList.remove(theme.class);
            }
        });
        
        // Apply new theme
        const theme = this.themes[index];
        if (theme.class) {
            document.body.classList.add(theme.class);
        }
        
        // Update icon
        if (this.themeIcon) {
            this.themeIcon.textContent = theme.icon;
        }
        
        // Save preference using Storage module
        Storage.set('selectedTheme', theme.class || '');
        
        console.log(`Theme applied: ${theme.name}`);
    }

    /**
     * Open theme modal
     */
    openThemeModal() {
        if (!this.themeModal) return;
        
        this.populateThemeOptions();
        this.themeModal.style.display = 'block';
        
        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.style.display = 'block';
        }
    }

    /**
     * Close theme modal
     */
    closeThemeModal() {
        if (!this.themeModal) return;
        
        this.themeModal.style.display = 'none';
        
        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    /**
     * Populate theme options in modal
     */
    populateThemeOptions() {
        if (!this.themeOptions) return;
        
        this.themeOptions.innerHTML = '';
        this.themes.forEach((theme, index) => {
            const option = document.createElement('div');
            option.className = 'theme-option';
            if (index === this.currentThemeIndex) {
                option.classList.add('active');
            }
            
            // Apply theme-specific styling to the card
            this.applyThemeCardStyle(option, theme);
            
            option.innerHTML = `
                <h3>${theme.icon} ${theme.name}</h3>
                <div class="theme-preview">
                    ${this.getThemePreview(theme)}
                </div>
            `;
            
            // Add click handler
            option.addEventListener('click', () => {
                this.currentThemeIndex = index;
                this.applyTheme(index);
                this.closeThemeModal();
                this.populateThemeOptions(); // Refresh to show new active state
            });
            
            this.themeOptions.appendChild(option);
        });
    }

    /**
     * Apply theme-specific styling to theme card
     * @param {HTMLElement} card - Theme card element
     * @param {Object} theme - Theme object
     */
    applyThemeCardStyle(card, theme) {
        // Basic styling for all cards
        card.style.cssText = `
            min-height: 180px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            padding: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        `;
        
        // Theme-specific colors
        const themeStyles = this.getThemeCardStyles();
        const themeStyle = themeStyles[theme.class] || themeStyles[''];
        
        // Apply theme-specific styling
        Object.assign(card.style, themeStyle);
    }

    /**
     * Get theme-specific card styles
     * @returns {Object} Theme styles object
     */
    getThemeCardStyles() {
        return {
            '': { background: '#f8f9fa', color: '#333', borderColor: '#dee2e6' },
            'dark-mode': { background: '#2d3748', color: '#e2e8f0', borderColor: '#4a5568' },
            'dracula': { background: '#282a36', color: '#f8f8f2', borderColor: '#6272a4' },
            'ocean-depth': { background: '#0a1628', color: '#e9f5f2', borderColor: '#00d4cc' },
            'gruvbox': { background: '#282828', color: '#ebdbb2', borderColor: '#fabd2f' },
            'nord': { background: '#2e3440', color: '#eceff4', borderColor: '#88c0d0' },
            'monokai': { background: '#272822', color: '#f8f8f2', borderColor: '#a6e22e' },
            'solarized-dark': { background: '#002b36', color: '#839496', borderColor: '#268bd2' }
        };
    }

    /**
     * Get theme preview HTML
     * @param {Object} theme - Theme object
     * @returns {string} Preview HTML
     */
    getThemePreview(theme) {
        const previews = {
            '': `
                <div style="background: #fff; padding: 8px; border-radius: 4px; font-family: monospace; font-size: 11px;">
                    <div style="color: #333; font-weight: bold;">SECTION</div>
                    <div style="color: #666;">man <span style="color: #0066cc; font-weight: 500;">command</span></div>
                </div>
            `,
            'dark-mode': `
                <div style="background: #1a202c; padding: 8px; border-radius: 4px; font-family: monospace; font-size: 11px;">
                    <div style="color: #4fd1c7; font-weight: bold;">SECTION</div>
                    <div style="color: #e2e8f0;">man <span style="color: #68d391; font-weight: 500;">command</span></div>
                </div>
            `,
            'ocean-depth': `
                <div style="background: #0a1628; padding: 8px; border-radius: 4px; font-family: monospace; font-size: 11px; box-shadow: 0 0 10px rgba(0, 212, 204, 0.2);">
                    <div style="color: #00d4cc; font-weight: bold; text-shadow: 0 0 10px rgba(0, 212, 204, 0.4);">SECTION</div>
                    <div style="color: #e9f5f2;">man <span style="color: #41b3ff; text-shadow: 0 0 5px rgba(65, 179, 255, 0.3);">command</span></div>
                </div>
            `
        };
        
        return previews[theme.class] || previews[''];
    }

    /**
     * Get all themes
     * @returns {Array} Array of theme objects
     */
    getThemes() {
        return this.themes;
    }

    /**
     * Get current theme index
     * @returns {number} Current theme index
     */
    getCurrentThemeIndex() {
        return this.currentThemeIndex;
    }
}

// Export singleton instance
export const Theme = new ThemeModule();
