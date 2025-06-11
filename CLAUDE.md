# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Linux Man Pages is a fully self-contained, offline-capable web application for searching and viewing Linux manual pages. Designed for static hosting on GitHub Pages or GitLab Pages, it provides instant access to 1,838 official Linux man pages and TLDR summaries without requiring any internet connection after deployment.

## Key Architecture

### Single-Page Application
- Complete application in `index.html` with inline CSS and JavaScript
- No build process required - just static files
- 16 modular theme CSS files in `themes/` directory
- Ocean Depth theme is the default (index 11 in themes array)

### Data Architecture
```
data/
├── index.js         # Search index (window.searchIndex)
└── tldr_index.js    # TLDR pages index

man_pages/           # 1,838 man page files
├── [command].[section].txt

tldr_pages/          # TLDR summaries
├── common/          # Cross-platform commands
└── linux/           # Linux-specific commands
```

### Theme System
- 16 themes with isolated styles to prevent conflicts
- Theme modal uses `!important` declarations for consistency
- Each theme includes styles for:
  - Search input, button, and section dropdown
  - Man page content and formatting
  - UI elements (bookmarks, history, etc.)

### Storage & Caching
- History: `localStorage.manPageHistory`
- Bookmarks: `localStorage.manPageBookmarks` 
- Theme preference: `localStorage.selectedTheme`
- TLDR cache: Built into distribution (no fetching needed)

## Development Commands

### Local Testing
```bash
# Start local server
python3 -m http.server 8000
# Visit http://localhost:8000

# Alternative with Node
npx http-server -p 8000
```

### Creating Distribution Archives
```bash
# Create tar and zip files for offline deployment
mkdir -p dist
tar -czf dist/linux-man-pages-v5.1.0.tar.gz \
  index.html data/ themes/ man_pages/ tldr_pages/ \
  package.json README.md LICENSE .gitlab-ci.yml .nojekyll

# Generate checksums
cd dist && sha256sum *.tar.gz *.zip > checksums-v5.1.0.txt
```

### Testing
```bash
# Install test dependencies
npm install puppeteer

# Run visual tests (if test scripts exist)
# Screenshots saved to test_screenshots/
```

### GitHub Release
```bash
# Create and publish release with distribution files
gh release create v5.1.0 \
  --title "Release v5.1.0: Enhanced theme system and offline distribution" \
  --notes-file RELEASE_NOTES_5.1.0.md \
  dist/linux-man-pages-v5.1.0.tar.gz
```

## Key Implementation Details

### Man Page Loading
- Man pages stored as individual `.txt` files in `man_pages/` directory
- Direct file loading via fetch() - no dynamic data files needed
- Format: `[command].[section].txt` (e.g., `ls.1.txt`)

### TLDR Integration  
- TLDR pages stored locally in `tldr_pages/common/` and `tldr_pages/linux/`
- No external fetching required - completely offline
- Indexed via `data/tldr_index.js` for quick lookup

### Search Implementation
- Real-time filtering of `window.searchIndex` from `data/index.js`
- Supports command name and description matching
- Section filtering via dropdown (sections 1-8)
- Instant results with no pagination limit

### Theme Modal Isolation
```css
/* Theme modal styles use !important to prevent theme overrides */
.theme-modal {
    background: white !important;
    color: #333 !important;
}
.theme-option {
    min-height: 180px;
    border: 2px solid #e0e0e0 !important;
}
```

## Critical Files
- `index.html` - Complete application with inline CSS/JS
- `themes/*.css` - 16 modular theme files
- `data/index.js` - Search index (must use window.searchIndex)
- `.nojekyll` - Required for GitHub Pages underscore files
- `.gitlab-ci.yml` - GitLab Pages deployment config

## Recent Updates (v5.1.0)

### Theme System Enhancements
- Fixed theme card layout consistency issues
- Added search element theming to all 16 themes
- Set Ocean Depth as default theme
- Isolated theme modal styles with `!important` declarations

### Distribution Package
- Created comprehensive tar.gz with all required files
- Includes GitLab CI config for offline deployment
- Generated SHA256 checksums for verification
- Published to GitHub releases with `gh` CLI

### Command Explainer Feature (New)
- Interactive command parser for shell commands
- Visual breakdown with color-coded tokens
- Hover tooltips showing explanations
- Hardcoded options database for testing (ls, grep, cat, find, tar)
- Keyboard shortcut 'E' to open explainer
- Integration with existing man page viewer

## Future Development

### Command Explainer Next Steps
1. Create Node.js script to extract options from all man pages
2. Generate comprehensive `data/options.js` database
3. Add support for piped commands and complex syntax
4. Include TLDR examples in explanations
5. Cache parsed commands for performance