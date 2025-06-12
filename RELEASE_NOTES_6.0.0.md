# Release v6.0.0: Massive Content Expansion

## Overview
This major release significantly expands the man page collection by integrating content from man.cx, adding over 1,250 new commands and updating 5,500+ existing pages with the latest documentation.

## What's New

### Content Expansion
- **9,371 total man pages** (up from 8,121) - a 15% increase
- **1,250 brand new commands** added to the collection
- **5,516 existing pages updated** with newer versions from man.cx
- Comprehensive coverage of Linux/Unix commands from Debian testing distribution

### New Commands Include
- Advanced systemd utilities (systemd-repart, systemd-battery-check, etc.)
- Container tools (podman commands, buildah, etc.)
- Modern development tools (cargo subcommands, gh CLI, etc.)
- Network utilities (firewall-cmd, nm-settings, etc.)
- Security tools (aa-enforce, setsebool, etc.)
- And many more specialized utilities

### Infrastructure
- Created automated scraping system for man.cx
- Intelligent deduplication to keep best versions
- Updated search index to include all new content

## Technical Details
- Scraped 7,419 pages from man.cx
- Discovered 12,864 potential man pages through reference analysis
- Implemented respectful rate-limited scraping
- Preserved existing TLDR summaries and bookmarks

## Usage
The application works exactly as before - just with much more content! Search for any Linux command and you're likely to find its documentation.

## Download
The offline distribution packages will be updated to include all new content.