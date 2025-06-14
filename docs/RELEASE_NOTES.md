# Release Notes

## 🚀 v7.7.0 - Enhanced Command Explainer & Perfect Tooltips

This release delivers a completely polished Command Explainer with bulletproof tooltip positioning and comprehensive grep support.

### ✨ New Features

- **Perfect Tooltip System**
  - Multi-directional smart positioning (above, below, left, right, center)
  - Guaranteed viewport visibility with edge detection
  - Beautiful glassmorphism design with smooth animations
  - Dynamic arrows that adapt to tooltip position
  - Fixed positioning to prevent any clipping issues

- **Enhanced Grep Support**
  - Added hardcoded fallback for 25 common grep options
  - Fixes missing options like `-C`, `-A`, `-B` that extraction script missed
  - Complete descriptions for context, matching, and output options
  - Proper argument type detection for options requiring values

### 🔧 Technical Improvements

- **Tooltip Positioning Algorithm**
  - Calculates available space in all directions
  - Falls back to side positioning when vertical space is limited
  - Centers in viewport as last resort
  - Maintains 10px minimum distance from all edges
  - Proper cleanup to prevent memory leaks

- **Command Parser Enhancements**
  - Fallback system for commands with incomplete option databases
  - Better handling of complex option formats
  - Improved option description accuracy

### 🐛 Bug Fixes
- Fixed tooltip clipping at viewport edges
- Fixed missing grep options in Command Explainer
- Fixed tooltip memory leaks on modal close
- Improved tooltip visibility on all themes

### 📦 Complete Offline Package
- All 10,296 man pages included
- 1,225 TLDR quick references
- 25 beautiful themes
- GitLab CI/CD ready (.gitlab-ci.yml)
- Zero external dependencies

---

## 🎉 v7.6.0 - Complete Offline Package (GitLab Ready)

This release provides a fully self-contained offline package optimized for GitLab Pages deployment.

### ✨ New Features

- **Enhanced Command Explainer Tooltips**
  - Fixed hover tooltips for commands, flags, and arguments
  - Improved visibility with proper z-index and overflow handling
  - Better theme integration across all 26 themes
  - Smooth animations for better UX

- **Professional Documentation**
  - Revamped README with modern, eye-catching design
  - Added CLAUDE.md for AI-assisted development
  - Comprehensive architecture documentation

### 🔧 Technical Improvements

- **Tooltip System Fixes**
  - Added visibility property for proper transitions
  - Increased z-index to 10000
  - Fixed container overflow issues
  - Enhanced theme-specific overrides

- **Content Growth**
  - 10,296 man pages (from 9,371)
  - 100+ TLDR summaries
  - 2,844 commands in options database

### 📦 Deployment

- Pre-configured `.gitlab-ci.yml`
- No build process required
- Complete offline functionality
- All assets included (55MB total)

---

## 📚 v7.5.3 - Enhanced Content & UI

### Features Added
- 100+ new TLDR pages for popular commands
- Updated command options database (2,844 commands)
- Auto-expanding sections in Command Explainer
- Restored options extraction script

---

## 🚀 v7.5.2 - Complete Offline Package

### Updates
- Restored GitHub Pages deployment workflow
- Repository cleanup
- Improved documentation
- Dual deployment support (GitHub + GitLab)

---

## 🔧 v7.5.1 - Stability Update

### Bug Fixes
- Fixed search controller race condition
- Enhanced null safety
- Improved concurrent search handling

---

## ✅ v7.5.0 - Production Ready

### Major Improvements
- 100% test coverage
- Fixed theme transitions
- GitLab CI/CD configuration
- Enhanced error handling

---

## Previous Releases

### v7.4.0 - Theme-Adaptive UI
- Theme-adaptive keyboard shortcuts modal
- Fixed side panel auto-open bug
- Complete theme integration

### v7.3.0 - Enhanced Theme Experience  
- Ayu Mirage as default theme
- Improved dropdown styling
- Better focus indicators

### v7.2.0 - Ultra-Performance Edition
- 10x search performance
- 3-5x faster DOM updates
- 50-80% memory reduction
- Virtual scrolling
- Progressive loading

### v7.1.0 - UI Improvements
- Simplified keyboard shortcuts modal
- Cleaner UX design
- Performance optimizations

### v7.0.0 - Major Theme Update
- 5 new themes added
- Revamped theme modal
- ESC key support
- Enhanced modal system