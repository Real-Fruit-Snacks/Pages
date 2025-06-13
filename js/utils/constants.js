/**
 * Application Constants
 * Central location for all application constants
 */

export const APP_CONSTANTS = {
    // Application info
    APP_NAME: 'Linux Man Pages',
    VERSION: '5.1.0',
    
    // Storage keys
    STORAGE_KEYS: {
        HISTORY: 'manPageHistory',
        BOOKMARKS: 'manPageBookmarks',
        THEME: 'selectedTheme'
    },
    
    // Limits
    MAX_HISTORY_ITEMS: 50,
    MAX_SEARCH_RESULTS: 100,
    MAX_COMMAND_LENGTH: 1000,
    SEARCH_DEBOUNCE_MS: 300,
    
    // File paths
    DATA_PATH: 'data/',
    MAN_PAGES_PATH: 'man_pages/',
    TLDR_PAGES_PATH: 'tldr_pages/',
    THEMES_PATH: 'themes/',
    
    // Man page sections
    MAN_SECTIONS: {
        1: 'User Commands',
        2: 'System Calls',
        3: 'Library Functions',
        4: 'Special Files',
        5: 'File Formats',
        6: 'Games',
        7: 'Miscellaneous',
        8: 'System Administration',
        9: 'Kernel Routines'
    },
    
    // Keyboard shortcuts
    SHORTCUTS: {
        SEARCH: '/',
        ESCAPE: 'Escape',
        THEME: 't',
        HELP: '?',
        COMMAND_EXPLAINER: 'e',
        BOOKMARKS: 'b',
        HISTORY: 'h',
        SEARCH_IN_PAGE: 'f',
        CLOSE: 'Escape',
        NEXT_RESULT: 'n',
        PREV_RESULT: 'p'
    },
    
    // UI Constants
    STATUS_DURATION: 3000,
    ANIMATION_DURATION: 300,
    MODAL_Z_INDEX: 1000,
    
    // Command token types
    TOKEN_TYPES: {
        COMMAND: 'command',
        OPTION: 'option',
        ARGUMENT: 'argument',
        PIPE: 'pipe',
        REDIRECT: 'redirect',
        STRING: 'string',
        VARIABLE: 'variable',
        GLOB: 'glob'
    },
    
    // Theme names
    THEMES: [
        'default',
        'dark',
        'solarized-dark',
        'solarized-light',
        'monokai',
        'dracula',
        'nord',
        'gruvbox',
        'material',
        'one-dark',
        'cyberpunk',
        'ocean-depth',
        'forest-night',
        'sunset',
        'midnight-blue',
        'high-contrast'
    ],
    
    // Default theme
    DEFAULT_THEME: 'ocean-depth'
};

// Freeze to prevent modifications
Object.freeze(APP_CONSTANTS);