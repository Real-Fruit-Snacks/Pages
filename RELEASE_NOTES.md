# Linux Man Pages v1.0.0

Self-contained Linux manual pages viewer for offline GitLab Pages deployment.

## 📦 What's Included

This release contains everything needed to deploy the Linux Man Pages application on an isolated GitLab Pages instance:

- **Complete web application** - Single-page application with all functionality
- **393 Linux commands** - Comprehensive man page coverage
- **No external dependencies** - Works completely offline
- **GitLab CI/CD ready** - Includes `.gitlab-ci.yml` for automatic deployment

## 🚀 Quick Deployment

1. Download `linux-man-pages-v1.0.0.tar.gz`
2. Extract to your GitLab repository
3. Push to GitLab - automatic deployment via CI/CD
4. Access at `https://[username].gitlab.io/[repo-name]/`

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

- **Compressed**: ~52KB (tar.gz)
- **Extracted**: ~392KB

## 🔒 Checksums

```
SHA256 (tar.gz): c7fb1d06d959a59e84c5c8bc73ae52147e67ecf014326c52e2535af4c0ca8ea9
```

## 📝 Note

TLDR summaries currently fetch from GitHub on first use, then cache locally. Future releases will include pre-bundled TLDR data for complete offline operation.