#!/usr/bin/env python3
"""
Scrape all English man pages from man.cx
"""

import os
import re
import time
import json
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import hashlib
from pathlib import Path
import logging
from collections import defaultdict
import html2text
from concurrent.futures import ThreadPoolExecutor, as_completed
import argparse

# Configuration
BASE_URL = "https://man.cx"
RATE_LIMIT = 0.5  # seconds between requests
MAX_WORKERS = 3  # number of concurrent workers
OUTPUT_DIR = Path("man_pages_new")
EXISTING_DIR = Path("man_pages")
CACHE_DIR = Path(".scraper_cache")
USER_AGENT = "Mozilla/5.0 (Linux Man Pages Scraper; educational use)"

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create directories
OUTPUT_DIR.mkdir(exist_ok=True)
CACHE_DIR.mkdir(exist_ok=True)

# HTML to text converter
h2t = html2text.HTML2Text()
h2t.ignore_links = False
h2t.ignore_images = True
h2t.body_width = 80


class ManPageScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({'User-Agent': USER_AGENT})
        self.discovered_commands = set()
        self.processed_pages = set()
        self.failed_pages = set()
        self.last_request_time = 0
        self.stats = defaultdict(int)
        
        # Load existing commands as seeds
        self._load_existing_commands()
        
        # Load cache
        self._load_cache()
    
    def _load_existing_commands(self):
        """Load commands from existing man pages"""
        if EXISTING_DIR.exists():
            for file in EXISTING_DIR.glob("*.txt"):
                # Extract command from filename (e.g., ls.1.txt -> ls)
                match = re.match(r'([^.]+)\.(\d+)\.txt', file.name)
                if match:
                    command = match.group(1)
                    self.discovered_commands.add(command)
        
        # Also load from current project's search index
        index_file = Path("data/index.js")
        if index_file.exists():
            content = index_file.read_text()
            # Extract commands from searchIndex
            matches = re.findall(r'"command":\s*"([^"]+)"', content)
            self.discovered_commands.update(matches)
        
        logger.info(f"Loaded {len(self.discovered_commands)} seed commands")
    
    def _load_cache(self):
        """Load processed pages cache"""
        cache_file = CACHE_DIR / "processed.json"
        if cache_file.exists():
            try:
                with open(cache_file, 'r') as f:
                    data = json.load(f)
                    self.processed_pages = set(data.get('processed', []))
                    self.failed_pages = set(data.get('failed', []))
                    logger.info(f"Loaded cache: {len(self.processed_pages)} processed, {len(self.failed_pages)} failed")
            except Exception as e:
                logger.warning(f"Failed to load cache: {e}")
    
    def _save_cache(self):
        """Save processed pages cache"""
        cache_file = CACHE_DIR / "processed.json"
        try:
            with open(cache_file, 'w') as f:
                json.dump({
                    'processed': list(self.processed_pages),
                    'failed': list(self.failed_pages)
                }, f, indent=2)
        except Exception as e:
            logger.warning(f"Failed to save cache: {e}")
    
    def _rate_limit(self):
        """Enforce rate limiting"""
        elapsed = time.time() - self.last_request_time
        if elapsed < RATE_LIMIT:
            time.sleep(RATE_LIMIT - elapsed)
        self.last_request_time = time.time()
    
    def _extract_text_from_html(self, html_content):
        """Convert HTML to clean text preserving man page formatting"""
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Find main content
        main = soup.find('main')
        if not main:
            main = soup.find('div', class_='main')
        
        if not main:
            return None
        
        # Remove navigation and unnecessary elements
        for elem in main.find_all(['nav', 'header', 'footer', 'aside']):
            elem.decompose()
        
        # Convert to text
        text = h2t.handle(str(main))
        
        # Clean up the text
        lines = text.split('\n')
        cleaned_lines = []
        
        for line in lines:
            # Remove markdown artifacts
            line = re.sub(r'\[#heading\d+\]', '', line)
            line = re.sub(r'\(#heading\d+\)', '', line)
            
            # Preserve formatting
            cleaned_lines.append(line)
        
        return '\n'.join(cleaned_lines).strip()
    
    def _discover_commands_from_page(self, text):
        """Extract references to other commands from man page text"""
        # Look for references in SEE ALSO section
        see_also_match = re.search(r'SEE ALSO.*?(?=\n[A-Z]|\Z)', text, re.DOTALL | re.IGNORECASE)
        if see_also_match:
            see_also_text = see_also_match.group(0)
            # Extract command(section) references
            commands = re.findall(r'(\w+)\(\d+\)', see_also_text)
            self.discovered_commands.update(commands)
        
        # Also look for command references in the text
        commands = re.findall(r'\b([a-z][a-z0-9_\-]+)\([1-8]\)', text)
        self.discovered_commands.update(cmd for cmd in commands if len(cmd) > 1)
    
    def fetch_man_page(self, command, section):
        """Fetch a single man page"""
        url = f"{BASE_URL}/{command}({section})"
        page_id = f"{command}.{section}"
        
        # Skip if already processed or failed
        if page_id in self.processed_pages or page_id in self.failed_pages:
            return None
        
        try:
            self._rate_limit()
            logger.info(f"Fetching {url}")
            
            response = self.session.get(url, timeout=30)
            
            if response.status_code == 404:
                self.failed_pages.add(page_id)
                self.stats['not_found'] += 1
                return None
            
            response.raise_for_status()
            
            # Extract text
            text = self._extract_text_from_html(response.text)
            if not text:
                logger.warning(f"No content extracted from {url}")
                self.failed_pages.add(page_id)
                self.stats['no_content'] += 1
                return None
            
            # Save the page
            output_file = OUTPUT_DIR / f"{command}.{section}.txt"
            output_file.write_text(text, encoding='utf-8')
            
            # Mark as processed
            self.processed_pages.add(page_id)
            self.stats['downloaded'] += 1
            
            # Discover new commands
            self._discover_commands_from_page(text)
            
            logger.info(f"Downloaded {page_id} ({len(text)} chars)")
            return page_id
            
        except requests.RequestException as e:
            logger.error(f"Failed to fetch {url}: {e}")
            self.failed_pages.add(page_id)
            self.stats['errors'] += 1
            return None
        except Exception as e:
            logger.error(f"Unexpected error for {url}: {e}")
            self.failed_pages.add(page_id)
            self.stats['errors'] += 1
            return None
    
    def scrape_all_sections(self, command):
        """Scrape all sections for a command"""
        found_any = False
        for section in range(1, 9):
            result = self.fetch_man_page(command, section)
            if result:
                found_any = True
        return found_any
    
    def run(self, max_commands=None):
        """Run the scraper"""
        logger.info("Starting scraper...")
        
        # Convert set to list for processing
        commands_to_process = list(self.discovered_commands)
        
        if max_commands:
            commands_to_process = commands_to_process[:max_commands]
        
        logger.info(f"Processing {len(commands_to_process)} commands")
        
        processed_count = 0
        
        try:
            for i, command in enumerate(commands_to_process):
                # Check all sections for this command
                if self.scrape_all_sections(command):
                    processed_count += 1
                
                # Save cache periodically
                if i % 50 == 0:
                    self._save_cache()
                    self._print_stats()
                
                # Check if we've discovered new commands
                new_commands = self.discovered_commands - set(commands_to_process)
                if new_commands and not max_commands:
                    logger.info(f"Discovered {len(new_commands)} new commands")
                    commands_to_process.extend(list(new_commands))
        
        except KeyboardInterrupt:
            logger.info("Interrupted by user")
        finally:
            self._save_cache()
            self._print_stats()
    
    def _print_stats(self):
        """Print scraping statistics"""
        logger.info(f"Stats: Downloaded: {self.stats['downloaded']}, "
                   f"Not found: {self.stats['not_found']}, "
                   f"No content: {self.stats['no_content']}, "
                   f"Errors: {self.stats['errors']}, "
                   f"Total commands: {len(self.discovered_commands)}")


def deduplicate_man_pages():
    """Replace existing man pages with new ones if they exist"""
    logger.info("Starting deduplication...")
    
    replaced = 0
    new_pages = 0
    
    for new_file in OUTPUT_DIR.glob("*.txt"):
        existing_file = EXISTING_DIR / new_file.name
        
        if existing_file.exists():
            # Compare content
            new_content = new_file.read_text()
            existing_content = existing_file.read_text()
            
            if new_content != existing_content:
                # Replace with new version
                existing_file.write_text(new_content)
                replaced += 1
                logger.info(f"Replaced {new_file.name}")
        else:
            # Copy new file
            import shutil
            shutil.copy2(new_file, existing_file)
            new_pages += 1
            logger.info(f"Added new page {new_file.name}")
    
    logger.info(f"Deduplication complete: {replaced} replaced, {new_pages} new")


def main():
    parser = argparse.ArgumentParser(description='Scrape man pages from man.cx')
    parser.add_argument('--max-commands', type=int, help='Maximum number of commands to process')
    parser.add_argument('--deduplicate', action='store_true', help='Only run deduplication')
    args = parser.parse_args()
    
    if args.deduplicate:
        deduplicate_man_pages()
    else:
        scraper = ManPageScraper()
        scraper.run(max_commands=args.max_commands)
        
        # Optionally deduplicate after scraping
        if input("\nRun deduplication? (y/n): ").lower() == 'y':
            deduplicate_man_pages()


if __name__ == "__main__":
    main()