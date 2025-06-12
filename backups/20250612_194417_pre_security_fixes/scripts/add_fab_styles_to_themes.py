#!/usr/bin/env python3
"""
Add FAB button styles to all themes that don't already have them.
"""

import os
import glob

# Theme-specific FAB button styles
THEME_FAB_STYLES = {
    'solarized-dark.css': '''
/* FAB Buttons */
body.solarized-dark .fab-container .fab {
    background-color: #268bd2 !important;
    color: #fdf6e3 !important;
    box-shadow: 0 4px 12px rgba(38, 139, 210, 0.3) !important;
}

body.solarized-dark .fab-container .fab:hover {
    background-color: #2176b1 !important;
    box-shadow: 0 6px 16px rgba(38, 139, 210, 0.4) !important;
    transform: scale(1.1);
}''',
    
    'dracula.css': '''
/* FAB Buttons */
body.dracula .fab-container .fab {
    background-color: #bd93f9 !important;
    color: #282a36 !important;
    box-shadow: 0 4px 12px rgba(189, 147, 249, 0.3) !important;
}

body.dracula .fab-container .fab:hover {
    background-color: #a77bef !important;
    box-shadow: 0 6px 16px rgba(189, 147, 249, 0.4) !important;
    transform: scale(1.1);
}''',
    
    'monokai.css': '''
/* FAB Buttons */
body.monokai .fab-container .fab {
    background-color: #66d9ef !important;
    color: #272822 !important;
    box-shadow: 0 4px 12px rgba(102, 217, 239, 0.3) !important;
}

body.monokai .fab-container .fab:hover {
    background-color: #52c7dd !important;
    box-shadow: 0 6px 16px rgba(102, 217, 239, 0.4) !important;
    transform: scale(1.1);
}''',
    
    'high-contrast.css': '''
/* FAB Buttons */
body.high-contrast .fab-container .fab {
    background-color: #ffff00 !important;
    color: #000000 !important;
    box-shadow: 0 4px 12px rgba(255, 255, 0, 0.3) !important;
}

body.high-contrast .fab-container .fab:hover {
    background-color: #e6e600 !important;
    box-shadow: 0 6px 16px rgba(255, 255, 0, 0.4) !important;
    transform: scale(1.1);
}''',
    
    'nord.css': '''
/* FAB Buttons */
body.nord .fab-container .fab {
    background-color: #88c0d0 !important;
    color: #2e3440 !important;
    box-shadow: 0 4px 12px rgba(136, 192, 208, 0.3) !important;
}

body.nord .fab-container .fab:hover {
    background-color: #7bb3c3 !important;
    box-shadow: 0 6px 16px rgba(136, 192, 208, 0.4) !important;
    transform: scale(1.1);
}''',
    
    'gruvbox.css': '''
/* FAB Buttons */
body.gruvbox .fab-container .fab {
    background-color: #fe8019 !important;
    color: #282828 !important;
    box-shadow: 0 4px 12px rgba(254, 128, 25, 0.3) !important;
}

body.gruvbox .fab-container .fab:hover {
    background-color: #fd7012 !important;
    box-shadow: 0 6px 16px rgba(254, 128, 25, 0.4) !important;
    transform: scale(1.1);
}''',
    
    'tokyo-night.css': '''
/* FAB Buttons */
body.tokyo-night .fab-container .fab {
    background-color: #7aa2f7 !important;
    color: #1a1b26 !important;
    box-shadow: 0 4px 12px rgba(122, 162, 247, 0.3) !important;
}

body.tokyo-night .fab-container .fab:hover {
    background-color: #6a92e7 !important;
    box-shadow: 0 6px 16px rgba(122, 162, 247, 0.4) !important;
    transform: scale(1.1);
}''',
    
    'one-dark.css': '''
/* FAB Buttons */
body.one-dark .fab-container .fab {
    background-color: #61afef !important;
    color: #282c34 !important;
    box-shadow: 0 4px 12px rgba(97, 175, 239, 0.3) !important;
}

body.one-dark .fab-container .fab:hover {
    background-color: #519fdf !important;
    box-shadow: 0 6px 16px rgba(97, 175, 239, 0.4) !important;
    transform: scale(1.1);
}''',
    
    'neon-noir.css': '''
/* FAB Buttons */
body.neon-noir .fab-container .fab {
    background-color: #ff00ff !important;
    color: #000000 !important;
    box-shadow: 0 4px 12px rgba(255, 0, 255, 0.3) !important;
}

body.neon-noir .fab-container .fab:hover {
    background-color: #e600e6 !important;
    box-shadow: 0 6px 16px rgba(255, 0, 255, 0.4) !important;
    transform: scale(1.1);
}''',
    
    'forest-dawn.css': '''
/* FAB Buttons */
body.forest-dawn .fab-container .fab {
    background-color: #52b788 !important;
    color: #2d3a2f !important;
    box-shadow: 0 4px 12px rgba(82, 183, 136, 0.3) !important;
}

body.forest-dawn .fab-container .fab:hover {
    background-color: #43a679 !important;
    box-shadow: 0 6px 16px rgba(82, 183, 136, 0.4) !important;
    transform: scale(1.1);
}''',
    
    'cyber-frost.css': '''
/* FAB Buttons */
body.cyber-frost .fab-container .fab {
    background-color: #00ffff !important;
    color: #003366 !important;
    box-shadow: 0 4px 12px rgba(0, 255, 255, 0.3) !important;
}

body.cyber-frost .fab-container .fab:hover {
    background-color: #00e6e6 !important;
    box-shadow: 0 6px 16px rgba(0, 255, 255, 0.4) !important;
    transform: scale(1.1);
}''',
    
    'retro-wave.css': '''
/* FAB Buttons */
body.retro-wave .fab-container .fab {
    background-color: #ff1b8d !important;
    color: #1e0033 !important;
    box-shadow: 0 4px 12px rgba(255, 27, 141, 0.3) !important;
}

body.retro-wave .fab-container .fab:hover {
    background-color: #e60a7c !important;
    box-shadow: 0 6px 16px rgba(255, 27, 141, 0.4) !important;
    transform: scale(1.1);
}''',
    
    'miami-sunrise.css': '''
/* FAB Buttons */
body.miami-sunrise .fab-container .fab {
    background-color: #ff6b6b !important;
    color: #1e1e1e !important;
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3) !important;
}

body.miami-sunrise .fab-container .fab:hover {
    background-color: #ff5252 !important;
    box-shadow: 0 6px 16px rgba(255, 107, 107, 0.4) !important;
    transform: scale(1.1);
}''',
    
    'light.css': '''
/* FAB Buttons */
body.light .fab-container .fab {
    background-color: #1967d2 !important;
    color: #ffffff !important;
    box-shadow: 0 4px 12px rgba(25, 103, 210, 0.3) !important;
}

body.light .fab-container .fab:hover {
    background-color: #1557b0 !important;
    box-shadow: 0 6px 16px rgba(25, 103, 210, 0.4) !important;
    transform: scale(1.1);
}''',
}

def main():
    themes_dir = 'themes'
    
    # Process each theme file
    for theme_file, fab_styles in THEME_FAB_STYLES.items():
        theme_path = os.path.join(themes_dir, theme_file)
        
        if not os.path.exists(theme_path):
            print(f"Theme file not found: {theme_path}")
            continue
        
        # Read the theme file
        with open(theme_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if FAB styles already exist
        if '.fab-container .fab' in content:
            print(f"FAB styles already exist in {theme_file}, skipping...")
            continue
        
        # Add FAB styles to the end of the file
        if not content.endswith('\n'):
            content += '\n'
        
        content += fab_styles + '\n'
        
        # Write back the updated content
        with open(theme_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"Added FAB styles to {theme_file}")

if __name__ == "__main__":
    main()