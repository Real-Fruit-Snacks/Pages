# Linux Man Pages v3.1.0

Self-contained Linux manual pages viewer with official documentation for offline deployment.

## 📦 What's Included

This release contains everything needed to deploy the Linux Man Pages application:

- **Complete web application** - Single-page application with all functionality
- **3,080 Linux commands** - Complete collection including find, grep, sed, awk, and all essential tools
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

- Contains 3,080 Linux man pages with complete coverage
- Includes official Linux man-pages project (2,487 pages)
- Plus 593 essential system utilities and tools
- Now includes critical commands like find, grep, sed, awk, tar, ssh, git, etc.
- Full coverage of all sections 1-8 with all essential Linux commands
- TLDR summaries fetch from GitHub on first use, then cache locally