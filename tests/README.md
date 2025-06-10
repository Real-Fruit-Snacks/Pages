# Test Scripts

This directory contains Puppeteer-based test scripts for the Linux Man Pages application.

## Test Files

### test_all_features.js
Comprehensive feature testing across all themes. Tests:
- Search functionality
- Man page display
- TLDR integration
- Navigation
- Bookmarks/History
- Theme switching

### test_all_features_robust.js
Enhanced version with better error handling and more detailed testing.

### test_theme_modular.js
Tests the modular theme CSS system to verify all theme files load correctly.

### test_js_fix.js
Quick test to verify JavaScript errors are fixed.

## Running Tests

```bash
# Install dependencies first
npm install

# Run a test
node tests/test_all_features_robust.js

# Start local server before running tests
python3 -m http.server 8000
```

## Note
These tests create screenshots in `test_screenshots/` which is git-ignored.