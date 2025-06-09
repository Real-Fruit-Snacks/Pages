# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a self-contained web application for searching and viewing Linux manual pages, designed for static hosting on GitHub Pages or GitLab Pages. The entire application is contained in a single `index.html` file with inline CSS and JavaScript, making it easy to deploy anywhere.

## Key Architecture & Data Loading

### Data Files Structure
The application uses a modular data loading system:
- `data/manifest.js` - Declares `window.manFiles` array listing all data files
- `data/index.js` - Declares `window.searchIndex` array with all searchable commands
- `data/man_1.js` - Contains `window.manData_1` object with actual man page content

### Critical Data Loading Mechanism
The `loadDataFile()` function in index.html dynamically loads man page data:
```javascript
const dataVarName = `manData_${fileNumber}`;
data = window[dataVarName];  // Must use window[varName], NOT eval()
```

**Important**: All data files must use `window.variableName` instead of `const variableName` to ensure global accessibility when loaded dynamically.

### Previous GitHub Pages Issues (Resolved)
Man page content was failing to load with "Data not found in file 1" error. Fixes applied:
1. Changed all data file declarations from `const` to `window.`
2. Replaced `eval(dataVarName)` with `window[dataVarName]`
3. Fixed syntax error in `data/man_1.js` - missing comma after zip_1 entry (line 323)

## Development Commands

### Local Testing
```bash
# Start local server
python3 -m http.server 8000
# Visit http://localhost:8000

# Alternative with Node
npx http-server -p 8000
```

### Man Page Data Management
```bash
# Collect and generate man page data from system
./collect_man_pages.sh

# Data now contains 1,838 official Linux man pages
# No placeholder management needed
```

### Testing with Puppeteer
```bash
# Install dependencies (only puppeteer needed for testing)
npm install

# Run specific test suites
node test_puppeteer.js                       # Basic functionality tests
node test_github_pages.js                   # GitHub Pages deployment tests
node test_error_detail.js                   # Error handling tests

# Visual testing (generates screenshots)
# Results saved to test_screenshots/
```

### Validation Before Push
```bash
# Run validation script before pushing
./validate.sh

# This checks:
# - JavaScript syntax in all .js files
# - Required files exist
# - Data files use window. declarations
# - No const declarations in data files
```

### Deployment
```bash
# GitHub Pages - automatic via GitHub Actions on push to main
git push origin main

# Manual deployment - just push files, no build needed
```

## Key Implementation Details

### TLDR Integration
- Fetches from `https://raw.githubusercontent.com/tldr-pages/tldr/main/pages/`
- Caches in localStorage with 7-day expiration
- Falls back gracefully if unavailable

### Search Implementation
- Real-time filtering of `window.searchIndex`
- Supports command name and description matching
- Section filtering via dropdown

### Man Page Display
- Lazy loads data files on demand
- Formats man page content with regex-based parsing
- Supports sections, lists, and basic formatting

### Storage
- History: `localStorage.manPageHistory`
- Bookmarks: `localStorage.manPageBookmarks`
- Dark mode: `localStorage.darkMode`
- TLDR cache: `localStorage.tldrCache_[command]`

## File Size Constraints
- GitHub Pages: 100MB file limit
- GitLab Pages: 100MB file limit
- Data automatically split across multiple files if needed

## Important Files
- `index.html` - Complete application (all CSS/JS inline)
- `.nojekyll` - Required for GitHub Pages to serve files starting with underscore
- `.github/workflows/deploy-pages.yml` - GitHub Actions deployment
- `.gitlab-ci.yml` - GitLab CI/CD deployment

## Development Patterns

### Man Page Content Updates
The project now uses official Linux man pages (1,838 commands) collected from the system.
To update or regenerate the data:
1. **Run collection script**: Use `./collect_man_pages.sh` to regenerate from system man pages
2. **Validate changes**: Run `./validate.sh` to ensure no syntax errors
3. **Test locally**: Start local server and verify man pages load correctly

### Data File Size Management
The `collect_man_pages.sh` script automatically splits data when files approach 80MB:
- Tracks current file size during generation
- Creates new `man_N.js` files as needed
- Updates `manifest.js` with file list
- Each file follows the pattern: `window.manData_N = { ... }`

### Search Index Synchronization
When adding/removing commands, update both:
- `data/index.js` - Search index with command metadata
- `data/man_N.js` - Actual man page content
- File references in search index must match actual data file numbers

### Testing Strategy
- **Puppeteer tests**: Automated browser testing for core functionality
- **Visual regression**: Screenshot comparisons in `test_screenshots/`
- **Deployment testing**: Specific tests for GitHub Pages environment
- **Error handling**: Tests for graceful degradation when data fails to load