# Release v6.1.0: Performance Revolution & Offline GitLab Deployment 🚀

## Major Performance Improvements

This release brings revolutionary performance optimizations that make the application load instantly and respond lightning-fast.

### ⚡ Performance Metrics
- **Page Load**: 32ms (from 1000ms+) - **97% faster!**
- **Initial Download**: ~300 bytes (from 941KB+)
- **Search Index**: Loaded on-demand (741KB saved)
- **Theme CSS**: Dynamic loading (190KB saved per page load)

### 🎯 Key Features

#### Dynamic Resource Loading
- Themes load only when selected
- Search index loads on first search
- Man pages cached for 10 minutes
- TLDR content loads on demand

#### Optimized Search Algorithm
- Hash map for instant exact matches
- Prefix indexing for 2-4 character queries
- Pre-tokenized descriptions
- 5-minute result caching

#### Enhanced Theme System
- All 16 themes tested across every UI element
- Fixed FAB button visibility in Light theme
- Proper theme switching with body classes
- Isolated theme modal styling

### 🔧 Technical Improvements
- Lazy loading for all heavy resources
- DocumentFragment DOM manipulation
- Efficient Array.join() HTML building
- Event delegation for better performance
- Smart caching with TTL management

### 🧹 Repository Cleanup
- Removed 17,000+ backup files
- Cleaned up temporary test scripts
- Updated .gitignore with comprehensive exclusions
- Streamlined README documentation

### 📦 Offline Deployment Package

This release includes a complete offline package ready for GitLab Pages deployment:
- All 9,371 man pages included
- All TLDR summaries included
- All 16 themes included
- GitLab CI configuration included
- Zero external dependencies

## Installation

### For GitLab Pages
```bash
# Download the release
wget https://github.com/Real-Fruit-Snacks/Pages/releases/download/v6.1.0/linux-man-pages-v6.1.0-offline-gitlab.tar.gz

# Extract
tar -xzf linux-man-pages-v6.1.0-offline-gitlab.tar.gz

# Push to GitLab
git init
git add .
git commit -m "Initial deployment"
git push -u origin main
```

Your GitLab Pages site will be automatically deployed!

### For GitHub Pages
Simply fork the repository and enable GitHub Pages in Settings.

## Checksums
See `checksums-v6.1.0.txt` for SHA256 verification.

---

**Full Changelog**: https://github.com/Real-Fruit-Snacks/Pages/compare/v5.2.0...v6.0.0