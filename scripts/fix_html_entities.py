#!/usr/bin/env python3
"""
Fix HTML entities in man pages by converting them to plain text equivalents.
"""

import os
import html
import re
from pathlib import Path

# Additional entities that html.unescape might miss
ADDITIONAL_ENTITIES = {
    '&minus;': '-',
    '&bull;': '•',
    '&mdash;': '—',
    '&ndash;': '–',
    '&rarr;': '→',
    '&lang;': '⟨',
    '&rang;': '⟩',
    '&middot;': '·',
    '&ge;': '≥',
    '&le;': '≤',
    '&ne;': '≠',
    '&plusmn;': '±',
    '&times;': '×',
    '&rsaquo;': '›',
    '&lsaquo;': '‹',
    '&raquo;': '»',
    '&laquo;': '«',
    '&acute;': '´',
    '&grave;': '`',
    '&circ;': '^',
    '&tilde;': '~',
    '&macr;': '¯',
    '&cedil;': '¸',
    '&uml;': '¨',
    '&cent;': '¢',
    '&pound;': '£',
    '&yen;': '¥',
    '&euro;': '€',
    '&sect;': '§',
    '&para;': '¶',
    '&dagger;': '†',
    '&Dagger;': '‡',
    '&permil;': '‰',
    '&prime;': '′',
    '&Prime;': '″',
    '&oelig;': 'œ',
    '&OElig;': 'Œ',
    '&aelig;': 'æ',
    '&AElig;': 'Æ',
    '&szlig;': 'ß',
    '&eth;': 'ð',
    '&ETH;': 'Ð',
    '&thorn;': 'þ',
    '&THORN;': 'Þ',
}

def fix_html_entities(text):
    """Fix HTML entities in text."""
    # First use html.unescape for standard entities
    text = html.unescape(text)
    
    # Then handle additional entities
    for entity, replacement in ADDITIONAL_ENTITIES.items():
        text = text.replace(entity, replacement)
    
    # Handle numeric entities (&#123; or &#x7B;)
    text = re.sub(r'&#(\d+);', lambda m: chr(int(m.group(1))), text)
    text = re.sub(r'&#x([0-9a-fA-F]+);', lambda m: chr(int(m.group(1), 16)), text)
    
    return text

def process_man_pages(directory):
    """Process all man pages in the directory."""
    man_pages_dir = Path(directory)
    fixed_count = 0
    total_entities = 0
    
    for man_file in man_pages_dir.glob('*.txt'):
        try:
            with open(man_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check if file contains HTML entities
            if '&' in content and ';' in content:
                original_content = content
                fixed_content = fix_html_entities(content)
                
                if fixed_content != original_content:
                    # Count entities fixed
                    entity_count = content.count('&') - fixed_content.count('&')
                    total_entities += entity_count
                    
                    # Write fixed content
                    with open(man_file, 'w', encoding='utf-8') as f:
                        f.write(fixed_content)
                    
                    fixed_count += 1
                    if fixed_count % 100 == 0:
                        print(f"Fixed {fixed_count} files...")
        
        except Exception as e:
            print(f"Error processing {man_file}: {e}")
    
    return fixed_count, total_entities

def main():
    print("Fixing HTML entities in man pages...")
    
    # Process man pages
    fixed_files, total_entities = process_man_pages('man_pages')
    
    print(f"\nFixed {fixed_files} files")
    print(f"Converted approximately {total_entities} HTML entities")
    
    # Show some examples of what was fixed
    print("\nExamples of fixed entities:")
    print("&rsquo; → '")
    print('&ldquo; → ", &rdquo; → "')
    print("&minus; → -")
    print("&bull; → •")
    print("&gt; → >, &lt; → <")
    print("&amp; → &")

if __name__ == "__main__":
    main()