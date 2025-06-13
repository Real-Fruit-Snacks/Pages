# Release v6.1.1: Critical Bug Fixes 🐛

## Bug Fixes

This patch release fixes critical errors that were occurring when viewing man pages.

### 🔧 Fixed Issues

#### 1. TLDR Display Error
- **Fixed**: `DOMException: Node.removeChild: The node to be removed is not a child of this node`
- **Cause**: Attempting to remove loading div that wasn't a child of the TLDR container
- **Solution**: Added parent node check before removing elements

#### 2. Duplicate Man Page Loading
- **Fixed**: Man pages were being loaded twice when clicking suggestions
- **Cause**: Click handler triggered hash change which called `displayManPage` again
- **Solution**: Added `isSettingHash` flag to prevent recursive hash handling

#### 3. Console Error Cleanup
- Eliminated all console errors when navigating between man pages
- Improved error handling for TLDR content loading
- Better state management for hash-based navigation

### 📦 Installation

#### For GitLab Pages (Offline Deployment)
```bash
# Download the release
wget https://github.com/Real-Fruit-Snacks/Pages/releases/download/v6.1.1/linux-man-pages-v6.1.1-offline-gitlab.tar.gz

# Extract
tar -xzf linux-man-pages-v6.1.1-offline-gitlab.tar.gz

# Push to GitLab
git init
git add .
git commit -m "Initial deployment"
git push -u origin main
```

#### For GitHub Pages
Simply update your fork to the latest version.

### 🔍 Technical Details

The fixes ensure:
- Clean console output with no errors
- Single loading of man pages (no duplicates)
- Proper TLDR content handling
- Stable hash-based navigation

## Checksums
See `checksums-v6.1.1.txt` for SHA256 verification.

---

**Full Changelog**: https://github.com/Real-Fruit-Snacks/Pages/compare/v6.1.0...v6.1.1