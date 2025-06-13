# Linux Man Pages

A blazing-fast, fully self-contained web application for searching and viewing Linux manual pages. Designed for static hosting with zero external dependencies. Works completely offline after deployment.

🚀 **[Live Demo](https://real-fruit-snacks.github.io/Pages/)**

## ✨ Key Features

- **🔍 Instant Search** - Real-time search with intelligent suggestions
- **📚 10,290 Man Pages** - Comprehensive Linux command documentation from official sources
- **📋 TLDR Integration** - Quick practical examples for common commands
- **🎨 16 Beautiful Themes** - From dark modes to high contrast
- **⚡ Lightning Fast** - 32ms page load, instant search results
- **🔒 100% Offline** - No CDNs, APIs, or external dependencies
- **💾 Smart Caching** - Lazy loading with intelligent caching
- **🔧 Command Explainer** - Interactive command breakdown (Press 'E')
- **⌨️ Keyboard Shortcuts** - Full keyboard navigation support
- **📱 Responsive Design** - Perfect on desktop and mobile

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)
1. Fork this repository
2. Go to Settings → Pages → Deploy from GitHub Actions
3. Access at: `https://[username].github.io/[repo-name]/`

### Option 2: Local Development
```bash
git clone https://github.com/Real-Fruit-Snacks/Pages.git
cd Pages
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Option 3: Download Release
```bash
wget https://github.com/Real-Fruit-Snacks/Pages/releases/latest/download/linux-man-pages.tar.gz
tar -xzf linux-man-pages.tar.gz
# Deploy to your web server
```

## 📁 Project Structure

```
├── index.html          # Complete application (16KB)
├── data/              
│   ├── index.js       # Search index (7,429 commands - loaded on demand)
│   ├── tldr_index.js  # TLDR pages index
│   └── options.js     # Command options database
├── themes/            # 16 modular theme CSS files
├── man_pages/         # 10,290 man page files
├── tldr_pages/        # 1,106 TLDR summaries
└── scripts/           # Maintenance utilities
```

## 🎯 Usage

### Search Commands
- Start typing to search 10,290+ commands
- Use section dropdown to filter by type
- Click suggestions or press Enter to view

### Keyboard Shortcuts
- `/` - Focus search
- `Escape` - Close man page or clear search
- `↑/↓` - Navigate suggestions
- `T` - Open theme selector
- `E` - Open command explainer
- `?` - Show help

### Features
- **History** - Track recently viewed pages (📚 button)
- **Bookmarks** - Save frequently used commands
- **TLDR** - Jump to quick examples (📋 button)
- **Command Explainer** - Break down complex commands

## 🎨 Themes

Choose from 16 carefully crafted themes:

- **Ocean Depth** 🌊 - Deep blue oceanic (default)
- **Dark** 🌙 - Classic dark with blue accents
- **Dracula** 🧛 - Popular purple-accented theme
- **Forest Dawn** 🌲 - Nature-inspired green
- **Gruvbox** 🍂 - Retro warm colors
- **High Contrast** ⚡ - Maximum readability
- **Light** ☀️ - Clean bright theme
- **Miami Sunrise** 🌺 - Vibrant tropical
- **Monokai** 🎨 - Classic editor theme
- **Neon Noir** 🌆 - Cyberpunk neon
- **Nord** 🏔️ - Arctic bluish clean
- **One Dark** 🌑 - Atom's iconic theme
- **Retro Wave** 🌴 - 80s synthwave
- **Solarized** 🌅 - Reduced eye strain
- **Tokyo Night** 🌃 - Modern Japanese-inspired

## ⚡ Performance

- **Page Load**: 32ms (down from 1000ms+)
- **Initial Download**: ~300 bytes
- **Search Index**: Loaded on first search
- **Theme CSS**: Loaded on demand
- **Man Pages**: Cached for 10 minutes
- **Search Results**: Cached for 5 minutes

## 📖 Man Page Sections

- **Section 1**: User commands (ls, grep, find)
- **Section 2**: System calls (open, read, write)
- **Section 3**: Library functions (printf, malloc)
- **Section 5**: File formats (passwd, fstab)
- **Section 7**: Miscellaneous (ascii, regex)
- **Section 8**: System administration (sudo, mount)

## 🛠️ Technical Details

- **Architecture**: Single-page application with inline CSS/JS
- **Data Format**: Pre-processed text files for instant loading
- **Search**: Optimized with hash maps and prefix indexing
- **Storage**: localStorage for preferences and history
- **Compatibility**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **Dependencies**: None - 100% self-contained

## 🔐 Privacy

- No analytics or tracking
- No external requests
- No cookies required
- All data stored locally
- Works in private mode

## 🤝 Contributing

Contributions welcome! Please submit issues or pull requests.

### Development Commands

```bash
# Update search index after adding man pages
python3 scripts/update_index.py

# Test locally
python3 -m http.server 8000

# Create release package
tar -czf linux-man-pages.tar.gz index.html data/ themes/ man_pages/ tldr_pages/
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

Linux manual pages remain under their original licenses.

## 🙏 Acknowledgments

- Linux man-pages project
- [TLDR Pages](https://github.com/tldr-pages/tldr) community
- All contributors and testers

## 📅 Recent Updates

### v6.2.0 (Latest)
- Updated man pages collection from official Linux sources
- Increased from 9,371 to 10,290 man pages
- Fixed Command Explainer bug where options weren't displaying
- Added missing traditional Unix commands (at, bg, cal, cd)
- Improved search index with 7,429 unique commands
- Enhanced TLDR coverage analysis

---

**Built with ❤️ for the Linux community**

*Making man pages accessible to everyone, everywhere.*