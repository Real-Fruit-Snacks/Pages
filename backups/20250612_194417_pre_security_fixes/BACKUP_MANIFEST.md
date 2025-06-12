# Backup Manifest

**Date**: 2025-01-12 19:44:17 UTC
**Purpose**: Full backup before implementing critical security fixes
**Git Status**: On branch main, CLAUDE.md modified

## Backup Contents
- `index.html` - Main application file (4,817 lines, monolithic)
- `data/` - Search indexes and command options
- `themes/` - 16 theme CSS files
- `man_pages/` - 9,915 man page files
- `tldr_pages/` - TLDR summary pages
- `scripts/` - Utility scripts
- `package.json` - Project configuration
- `README.md` - Project documentation
- `LICENSE` - MIT license
- `.gitlab-ci.yml` - GitLab deployment config
- `.nojekyll` - GitHub Pages config
- `CLAUDE.md` - AI assistant instructions
- `IMPROVEMENTS_CHECKLIST.md` - Comprehensive improvement list
- `CRITICAL_IMPLEMENTATION_PLAN.md` - 10-day implementation plan

## Critical Issues to Address
1. XSS vulnerabilities via innerHTML usage
2. No input sanitization in Command Explainer
3. Direct HTML string manipulation throughout
4. Potential ReDoS vulnerabilities
5. Memory leaks from event listeners

## Recovery Instructions
To restore from this backup:
```bash
# From project root
cp -r backups/20250612_194417_pre_security_fixes/* .
```

## Next Steps
Implementing Phase 1 of security fixes as documented in CRITICAL_IMPLEMENTATION_PLAN.md