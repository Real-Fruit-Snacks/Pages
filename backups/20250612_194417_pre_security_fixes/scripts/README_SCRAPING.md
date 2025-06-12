# Man Page Scraping from man.cx

This directory contains scripts for downloading man pages from man.cx to expand the collection.

## Overview

man.cx hosts 229,438 man pages (including translations) extracted from Debian testing. The English pages are accessible without language suffixes (e.g., `https://man.cx/ls(1)`).

## Scripts

### 1. `scrape_man_cx_optimized.py` (Recommended)

The main scraper with intelligent discovery and concurrent downloading.

**Features:**
- Discovers man pages through multiple methods:
  - Existing man pages as seeds
  - Common Unix/Linux commands
  - References found in downloaded pages
- Concurrent downloading with rate limiting
- State persistence (can resume if interrupted)
- Automatic deduplication

**Usage:**
```bash
# First run - will discover and download all pages
python3 scrape_man_cx_optimized.py

# Resume interrupted scraping
python3 scrape_man_cx_optimized.py

# Reset and start fresh
python3 scrape_man_cx_optimized.py --reset

# Only merge previously downloaded pages
python3 scrape_man_cx_optimized.py --merge
```

### 2. `update_index.py`

Updates the search index after adding new man pages.

**Usage:**
```bash
python3 update_index.py
```

### 3. `scrape_man_cx.py` (Alternative)

Alternative scraper with different approach (uses BeautifulSoup for HTML parsing).

## Scraping Process

1. **Discovery Phase**
   - Script starts with seed commands from existing collection
   - Checks all 8 sections for each command
   - Discovers new commands from "SEE ALSO" sections

2. **Download Phase**
   - Downloads pages with rate limiting (0.2s between requests)
   - Uses 5 concurrent workers for efficiency
   - Saves to `man_pages_new/` directory first

3. **Merge Phase**
   - Compares new pages with existing ones
   - Replaces if content differs significantly
   - Adds new pages to collection

4. **Index Update**
   - Run `update_index.py` to rebuild search index
   - Includes all new and updated pages

## Important Notes

1. **Rate Limiting**: The scripts respect man.cx with delays between requests
2. **Storage**: New pages are first saved to `man_pages_new/` before merging
3. **State Persistence**: Progress is saved in `.scraper_cache/`
4. **Discovery**: The scraper continuously discovers new pages from references

## Expected Results

- Initial run may take several hours
- Expect to find 10,000+ English man pages
- Many will be updated versions of existing pages
- Some will be entirely new commands

## Post-Scraping

After scraping completes:

1. Review the statistics
2. Merge new pages with existing collection
3. Run `update_index.py` to update search index
4. Test the application to ensure everything works

## Troubleshooting

**Script seems stuck:**
- Check `.scraper_cache/scraper_state.json` for progress
- Interrupt with Ctrl+C and restart (progress is saved)

**Too many failures:**
- man.cx might be rate limiting more aggressively
- Increase RATE_LIMIT in the script

**Missing dependencies:**
```bash
pip install requests beautifulsoup4 html2text
```