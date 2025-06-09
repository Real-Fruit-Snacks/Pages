# Linux Man Pages v3.1.0

Self-contained Linux manual pages viewer with official documentation for offline deployment.

## 📦 What's Included

This release contains everything needed to deploy the Linux Man Pages application:

- **Complete web application** - Single-page application with all functionality
- **2,926 Linux commands** - Comprehensive collection including official man pages and essential utilities
- **No external dependencies** - Works completely offline
- **GitHub/GitLab Pages ready** - Automatic deployment via CI/CD

## 🚀 Quick Deployment

1. Download the latest release
2. Extract to your repository  
3. Push to GitHub/GitLab - automatic deployment via CI/CD
4. Access at `https://[username].[github|gitlab].io/[repo-name]/`

## ✨ Features

- Real-time command search
- Dark mode support
- Bookmarks & history tracking
- TLDR summaries (cached after first fetch)
- Section filtering (1-8)
- Responsive design
- Keyboard navigation

## 📋 Package Contents

- `index.html` - Complete application
- `data/` - All man page data
- `.gitlab-ci.yml` - GitLab Pages config
- `README.md` - Documentation
- Build scripts (optional)

## 📏 Package Size

- **Compressed**: ~1.2MB (tar.gz)
- **Extracted**: ~3.9MB
- **Data files**: Split into manageable chunks under 80MB each

## 🔒 Checksums

*Checksums will be generated for official releases*

## 📝 Note

- Contains 2,926 Linux man pages with comprehensive coverage
- Includes official Linux man-pages project (2,487 pages)
- Plus 439 essential system utilities (coreutils, util-linux, etc.)
- Full coverage of all sections 1-8 including everyday commands
- TLDR summaries fetch from GitHub on first use, then cache locally