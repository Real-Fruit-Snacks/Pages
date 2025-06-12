#!/usr/bin/env python3
"""
Optimized scraper for man.cx - discovers and downloads all English man pages
"""

import os
import re
import time
import json
import requests
from pathlib import Path
import logging
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
import argparse
from urllib.parse import quote

# Configuration
BASE_URL = "https://man.cx"
RATE_LIMIT = 0.2  # seconds between requests per worker
MAX_WORKERS = 5  # number of concurrent workers
OUTPUT_DIR = Path("man_pages_new")
EXISTING_DIR = Path("man_pages")
CACHE_DIR = Path(".scraper_cache")
STATE_FILE = CACHE_DIR / "scraper_state.json"

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create directories
OUTPUT_DIR.mkdir(exist_ok=True)
CACHE_DIR.mkdir(exist_ok=True)


class ManCxScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (compatible; ManPageArchiver/1.0)'
        })
        
        # State tracking
        self.discovered_pages = set()  # (command, section) tuples
        self.processed_pages = set()
        self.failed_pages = set()
        self.stats = defaultdict(int)
        
        # Load state
        self._load_state()
        
        # If no discovered pages, bootstrap from multiple sources
        if not self.discovered_pages:
            self._bootstrap_discovery()
    
    def _load_state(self):
        """Load scraper state from disk"""
        if STATE_FILE.exists():
            try:
                with open(STATE_FILE, 'r') as f:
                    state = json.load(f)
                    self.discovered_pages = set(tuple(p) for p in state.get('discovered', []))
                    self.processed_pages = set(tuple(p) for p in state.get('processed', []))
                    self.failed_pages = set(tuple(p) for p in state.get('failed', []))
                    logger.info(f"Loaded state: {len(self.discovered_pages)} discovered, "
                              f"{len(self.processed_pages)} processed")
            except Exception as e:
                logger.warning(f"Failed to load state: {e}")
    
    def _save_state(self):
        """Save scraper state to disk"""
        try:
            with open(STATE_FILE, 'w') as f:
                json.dump({
                    'discovered': list(self.discovered_pages),
                    'processed': list(self.processed_pages),
                    'failed': list(self.failed_pages),
                    'stats': dict(self.stats)
                }, f, indent=2)
        except Exception as e:
            logger.warning(f"Failed to save state: {e}")
    
    def _bootstrap_discovery(self):
        """Bootstrap discovery from multiple sources"""
        logger.info("Bootstrapping command discovery...")
        
        # 1. From existing man pages
        if EXISTING_DIR.exists():
            for file in EXISTING_DIR.glob("*.txt"):
                match = re.match(r'([^.]+)\.(\d+)\.txt', file.name)
                if match:
                    command, section = match.groups()
                    self.discovered_pages.add((command, int(section)))
        
        # 2. From search index
        index_file = Path("data/index.js")
        if index_file.exists():
            content = index_file.read_text()
            for match in re.finditer(r'"command":\s*"([^"]+)".*?"section":\s*(\d+)', content):
                command, section = match.groups()
                self.discovered_pages.add((command, int(section)))
        
        # 3. Common Unix commands (comprehensive list)
        common_commands = self._get_common_commands()
        for cmd in common_commands:
            # Check all sections for common commands
            for section in range(1, 9):
                self.discovered_pages.add((cmd, section))
        
        logger.info(f"Bootstrap complete: {len(self.discovered_pages)} pages to check")
    
    def _get_common_commands(self):
        """Get a comprehensive list of common Unix commands"""
        # This is a curated list of essential Unix/Linux commands
        return [
            # Core utilities
            'ls', 'cp', 'mv', 'rm', 'mkdir', 'rmdir', 'touch', 'cat', 'echo', 'pwd',
            'cd', 'chmod', 'chown', 'chgrp', 'ln', 'find', 'grep', 'sed', 'awk', 'sort',
            'uniq', 'cut', 'paste', 'tr', 'wc', 'head', 'tail', 'less', 'more', 'vi',
            'vim', 'emacs', 'nano', 'ed', 'diff', 'patch', 'tar', 'gzip', 'gunzip',
            'zip', 'unzip', 'bzip2', 'xz', 'file', 'which', 'whereis', 'locate', 'updatedb',
            
            # System commands
            'ps', 'top', 'htop', 'kill', 'killall', 'jobs', 'bg', 'fg', 'nice', 'renice',
            'nohup', 'time', 'date', 'cal', 'uptime', 'w', 'who', 'whoami', 'id', 'groups',
            'passwd', 'su', 'sudo', 'useradd', 'usermod', 'userdel', 'groupadd', 'groupmod',
            'mount', 'umount', 'df', 'du', 'fdisk', 'mkfs', 'fsck', 'lsblk', 'blkid',
            
            # Network commands
            'ping', 'traceroute', 'netstat', 'ss', 'ip', 'ifconfig', 'route', 'arp',
            'dig', 'nslookup', 'host', 'wget', 'curl', 'ssh', 'scp', 'sftp', 'rsync',
            'telnet', 'ftp', 'nc', 'netcat', 'tcpdump', 'iptables', 'firewall-cmd',
            
            # Development tools
            'gcc', 'g++', 'make', 'cmake', 'git', 'svn', 'cvs', 'diff', 'patch',
            'gdb', 'strace', 'ltrace', 'valgrind', 'ld', 'ldd', 'nm', 'objdump',
            'ar', 'ranlib', 'strip', 'size', 'strings', 'readelf', 'file',
            
            # Text processing
            'perl', 'python', 'python3', 'ruby', 'php', 'node', 'java', 'javac',
            'lex', 'yacc', 'bison', 'flex', 'm4', 'bc', 'dc', 'expr',
            
            # Package management
            'apt', 'apt-get', 'aptitude', 'dpkg', 'yum', 'dnf', 'rpm', 'zypper',
            'pacman', 'emerge', 'pkg', 'brew', 'snap', 'flatpak',
            
            # System administration
            'systemctl', 'service', 'journalctl', 'dmesg', 'lsmod', 'modprobe',
            'insmod', 'rmmod', 'sysctl', 'hostnamectl', 'timedatectl', 'localectl',
            'loginctl', 'cron', 'crontab', 'at', 'batch', 'systemd', 'init',
            
            # Shell builtins and features
            'bash', 'sh', 'zsh', 'fish', 'tcsh', 'csh', 'ksh', 'dash', 'source',
            'export', 'alias', 'unalias', 'history', 'fc', 'type', 'which', 'command',
            'builtin', 'enable', 'help', 'exec', 'exit', 'logout', 'return', 'break',
            'continue', 'test', '[', '[[', 'case', 'if', 'for', 'while', 'until',
            'function', 'declare', 'typeset', 'readonly', 'local', 'getopts', 'shift',
            'set', 'unset', 'env', 'printenv', 'read', 'printf', 'let', 'eval'
        ]
    
    def _extract_text_from_html(self, html_content, url):
        """Extract plain text from man.cx HTML page"""
        # Remove HTML tags but preserve structure
        text = re.sub(r'<script[^>]*>.*?</script>', '', html_content, flags=re.DOTALL)
        text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL)
        
        # Extract main content between specific markers
        main_match = re.search(r'<main[^>]*>(.*?)</main>', text, re.DOTALL)
        if main_match:
            text = main_match.group(1)
        
        # Convert HTML entities
        text = text.replace('&nbsp;', ' ')
        text = text.replace('&lt;', '<')
        text = text.replace('&gt;', '>')
        text = text.replace('&amp;', '&')
        text = text.replace('&quot;', '"')
        text = text.replace('&#39;', "'")
        
        # Remove remaining HTML tags
        text = re.sub(r'<[^>]+>', '', text)
        
        # Clean up whitespace
        text = re.sub(r'\n\s*\n', '\n\n', text)
        text = text.strip()
        
        # Ensure we got actual content
        if len(text) < 100 or 'Not Found' in text[:200]:
            return None
        
        return text
    
    def _discover_from_text(self, text):
        """Discover new man page references from text"""
        # Find all command(section) references
        references = re.findall(r'\b([a-zA-Z0-9_\-\+\.]+)\(([1-8])\)', text)
        
        for cmd, section in references:
            # Filter out unlikely commands
            if len(cmd) > 1 and not cmd[0].isdigit():
                self.discovered_pages.add((cmd, int(section)))
    
    def fetch_page(self, command, section):
        """Fetch a single man page"""
        page_id = (command, section)
        
        if page_id in self.processed_pages:
            return True
        
        if page_id in self.failed_pages:
            return False
        
        url = f"{BASE_URL}/{quote(command)}({section})"
        
        try:
            response = self.session.get(url, timeout=10)
            
            if response.status_code == 404:
                self.failed_pages.add(page_id)
                return False
            
            response.raise_for_status()
            
            # Extract text
            text = self._extract_text_from_html(response.text, url)
            if not text:
                self.failed_pages.add(page_id)
                return False
            
            # Save the page
            output_file = OUTPUT_DIR / f"{command}.{section}.txt"
            output_file.write_text(text, encoding='utf-8')
            
            # Discover new references
            self._discover_from_text(text)
            
            self.processed_pages.add(page_id)
            self.stats['downloaded'] += 1
            
            logger.info(f"Downloaded {command}({section}) - {len(text)} chars")
            return True
            
        except Exception as e:
            logger.debug(f"Failed {command}({section}): {e}")
            self.failed_pages.add(page_id)
            self.stats['failed'] += 1
            return False
    
    def worker(self, pages_queue):
        """Worker thread for downloading pages"""
        while pages_queue:
            try:
                command, section = pages_queue.pop(0)
                self.fetch_page(command, section)
                time.sleep(RATE_LIMIT)
            except IndexError:
                break
            except Exception as e:
                logger.error(f"Worker error: {e}")
    
    def run(self):
        """Run the scraper with multiple workers"""
        logger.info("Starting optimized scraper...")
        
        # Get pages to process
        pages_to_process = list(self.discovered_pages - self.processed_pages - self.failed_pages)
        logger.info(f"Pages to process: {len(pages_to_process)}")
        
        if not pages_to_process:
            logger.info("No pages to process")
            return
        
        # Process with thread pool
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            # Divide work among workers
            chunk_size = max(1, len(pages_to_process) // MAX_WORKERS)
            futures = []
            
            for i in range(0, len(pages_to_process), chunk_size):
                chunk = pages_to_process[i:i + chunk_size]
                future = executor.submit(self.worker, chunk)
                futures.append(future)
            
            # Wait for completion and save state periodically
            try:
                for i, future in enumerate(as_completed(futures)):
                    future.result()
                    
                    # Save state every 100 downloads
                    if self.stats['downloaded'] % 100 == 0:
                        self._save_state()
                        self._print_progress()
            
            except KeyboardInterrupt:
                logger.info("Interrupted by user")
                executor.shutdown(wait=False)
        
        # Final save
        self._save_state()
        self._print_final_stats()
        
        # Check for newly discovered pages
        new_pages = self.discovered_pages - self.processed_pages - self.failed_pages
        if new_pages:
            logger.info(f"Discovered {len(new_pages)} new pages during scraping")
            if input("Continue with newly discovered pages? (y/n): ").lower() == 'y':
                self.run()  # Recursive call to process new discoveries
    
    def _print_progress(self):
        """Print progress stats"""
        total = len(self.discovered_pages)
        processed = len(self.processed_pages)
        failed = len(self.failed_pages)
        remaining = total - processed - failed
        
        logger.info(f"Progress: {processed}/{total} ({processed/total*100:.1f}%) | "
                   f"Failed: {failed} | Remaining: {remaining}")
    
    def _print_final_stats(self):
        """Print final statistics"""
        logger.info("\n" + "="*50)
        logger.info("Scraping Complete!")
        logger.info(f"Total discovered: {len(self.discovered_pages)}")
        logger.info(f"Successfully downloaded: {len(self.processed_pages)}")
        logger.info(f"Failed: {len(self.failed_pages)}")
        logger.info(f"New files created: {self.stats['downloaded']}")
        logger.info("="*50)


def merge_with_existing():
    """Merge new man pages with existing collection"""
    logger.info("\nMerging new pages with existing collection...")
    
    replaced = 0
    added = 0
    
    for new_file in OUTPUT_DIR.glob("*.txt"):
        existing_file = EXISTING_DIR / new_file.name
        
        if existing_file.exists():
            # Compare sizes as a quick check
            new_size = new_file.stat().st_size
            existing_size = existing_file.stat().st_size
            
            if abs(new_size - existing_size) > 100:  # Significant difference
                import shutil
                shutil.copy2(new_file, existing_file)
                replaced += 1
                logger.debug(f"Replaced {new_file.name}")
        else:
            import shutil
            shutil.copy2(new_file, EXISTING_DIR)
            added += 1
            logger.debug(f"Added {new_file.name}")
    
    logger.info(f"Merge complete: {added} added, {replaced} replaced")
    
    # Update search index
    logger.info("Remember to run update_index.py to rebuild the search index!")


def main():
    parser = argparse.ArgumentParser(description='Scrape all English man pages from man.cx')
    parser.add_argument('--merge', action='store_true', 
                       help='Merge downloaded pages with existing collection')
    parser.add_argument('--reset', action='store_true',
                       help='Reset scraper state and start fresh')
    args = parser.parse_args()
    
    if args.reset:
        if STATE_FILE.exists():
            STATE_FILE.unlink()
            logger.info("Reset scraper state")
    
    if args.merge:
        merge_with_existing()
    else:
        scraper = ManCxScraper()
        scraper.run()
        
        if input("\nMerge with existing collection? (y/n): ").lower() == 'y':
            merge_with_existing()


if __name__ == "__main__":
    main()