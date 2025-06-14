# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a fully self-contained web application for browsing Linux man pages with TLDR summaries and multiple themes. The entire application runs from a single `index.html` file with inline CSS and JavaScript, making it perfectly suited for offline use and static hosting.

## Key Architecture

### Single-File Application
- **index.html**: Contains the entire application (HTML, CSS, JavaScript inline)
- No build process or dependencies required
- All theme CSS is embedded within the HTML file
- Application state managed via localStorage and URL parameters

### Data Structure
- **data/index.js**: Main search index with 10,296 commands
- **data/tldr_index.js**: TLDR pages index with 100+ summaries  
- **data/options.js**: Command options database with 2,844 commands
- **man_pages/**: Directory containing 10,296 `.txt` files (command.section.txt format)
- **tldr_pages/**: Markdown files with quick command summaries

### Performance Optimizations
- Virtual scrolling for large result sets
- Debounced search with AbortController for request cancellation
- DOM element recycling to reduce memory usage
- Progressive loading of search index chunks
- Theme CSS preloading and caching

## Common Development Commands

### Local Development
```bash
# Start local server (Python)
python3 -m http.server 8000

# Start local server (Node.js)
npx http-server -p 8000
```

### Content Updates
```bash
# Update search index after adding man pages
python3 scripts/update_index.py

# Update command options database
node extract-options.js

# Run tests (if puppeteer installed)
npm install puppeteer
node test_comprehensive.js
```

### Linting and Type Checking
```bash
# The project uses pure JavaScript with no linting setup
# When making changes, ensure:
# - No syntax errors in JavaScript
# - Proper CSS syntax in theme definitions
# - Valid HTML structure
```

## Critical Implementation Details

### Search Implementation
The search uses a two-phase approach:
1. Quick filtering on command names for instant results
2. Full-text search through descriptions with debouncing

Key functions:
- `searchCommands()`: Main search orchestrator
- `quickFilterCommands()`: Instant name matching
- `performSearch()`: Full-text search with ranking

### Theme System
Themes are defined as inline `<style>` blocks with `data-theme` attributes. Theme switching:
1. Disables all theme styles
2. Enables selected theme style block
3. Updates CSS variables for dropdown/modal styling
4. Saves preference to localStorage

### Modal System
Modals use a shared backdrop system with exclusive display:
- Only one modal can be shown at a time
- ESC key closes any open modal
- Modals adapt to current theme colors

### Command Explainer
The Command Explainer modal:
- Parses commands using the options database
- Shows TLDR content when available
- Auto-expands sections without scroll bars (recent update)

## State Management

### URL Parameters
- `#command-name` or `#command-name.section`: Direct link to man page
- Theme state stored in localStorage only

### LocalStorage Keys
- `selectedTheme`: Current theme name
- `commandHistory`: Array of recently viewed commands
- `bookmarkedCommands`: Array of bookmarked commands
- `sidebarCollapsed`: Boolean for sidebar state

## Deployment

The application deploys automatically to:
- GitHub Pages via `.github/workflows/deploy-pages.yml`
- GitLab Pages via `.gitlab-ci.yml`

Both configurations simply copy all files to the deployment directory - no build needed.

## Important Constraints

1. **Self-Contained**: Never add external dependencies or build processes
2. **Inline Everything**: Keep all CSS/JS within index.html
3. **Offline First**: All features must work without internet
4. **Performance**: Maintain fast search and smooth scrolling with 10K+ items
5. **Theme Consistency**: Every UI element must adapt to all 26 themes

## Data Generation Scripts

### extract-options.js
Parses man pages to extract command options:
- Handles various man page formats
- Improved gap handling for better parsing
- Outputs to `data/options.js`

### scripts/update_index.py  
Rebuilds the search index from man pages:
- Extracts command names and descriptions
- Splits into section-based chunks
- Maintains compatibility with virtual scrolling