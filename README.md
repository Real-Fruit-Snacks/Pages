# Linux Man Pages

A modern, fully self-contained web application for searching and viewing Linux manual pages. Features instant search, TLDR summaries, and beautiful themes - all working completely offline.

![Version](https://img.shields.io/badge/version-6.4.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Man Pages](https://img.shields.io/badge/man%20pages-9%2C371-orange.svg)
![Themes](https://img.shields.io/badge/themes-26-purple.svg)

## 🚀 Features

### Core Functionality
- **9,371 Linux man pages** - Comprehensive coverage of Linux commands
- **Instant search** - Real-time filtering as you type
- **TLDR integration** - Quick summaries for common use cases
- **Completely offline** - No internet required after deployment
- **Section filtering** - Browse by category (1-8)
- **Related commands** - Discover similar tools
- **Command explainer** - Break down complex command syntax

### User Experience
- **26 beautiful themes** - From classic dark to vibrant synthwave
- **Keyboard shortcuts** - Navigate efficiently with hotkeys
- **History tracking** - Access recently viewed pages
- **Bookmarks** - Save frequently used commands
- **Responsive design** - Works on desktop and mobile
- **No build process** - Pure HTML/CSS/JS

## 🎨 Themes

Choose from 26 carefully crafted themes:

### Dark Themes
- Ayu Mirage - Warm colors with orange accents
- Catppuccin Mocha - Soothing pastel dark theme
- Dracula - Popular purple-based dark theme
- Everforest - Natural forest-inspired colors
- GitHub Dark - GitHub's official dark theme
- Gruvbox - Retro groove with warm colors
- Kanagawa - Japanese wave-inspired palette
- Material Design - Google's Material You
- Monokai - Classic syntax highlighting
- Nord - Arctic, north-bluish colors
- Ocean Depth - Deep sea exploration
- One Dark - Atom's iconic dark theme
- Palenight - Soft purples and pastels
- Rose Pine - Soho vibes with rose tones
- Solarized - Precision colors for readability
- Tokyo Night - Tokyo city lights at night

### Light Themes
- Light - Clean and bright default
- Hotdog Stand - Windows 3.1 nostalgia

### Vibrant Themes
- Cyber Frost - Cool blue cyberpunk aesthetics
- Miami Sunrise - Vibrant Miami Vice vibes
- Neon Noir - Cyberpunk neon glow
- Retro Wave - 80s synthwave aesthetics
- Synthwave '84 - Neon-soaked retro future

### Nature Themes
- Forest Dawn - Soft greens and earth tones
- Everforest - Calm forest colors
- Kanagawa - Traditional Japanese aesthetics

## ⌨️ Keyboard Shortcuts

### Navigation
- `/` - Focus search input
- `↑` `↓` - Navigate suggestions
- `Enter` - Select suggestion
- `Esc` - Close current view

### Features
- `T` - Open theme selector
- `E` - Open command explainer
- `H` - Toggle history panel
- `?` - Show keyboard shortcuts

### Productivity
- `Ctrl+B` - Bookmark current page
- `Ctrl+F` - Search in page

## 🛠️ Installation

### Quick Start
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/linux-man-pages.git
   cd linux-man-pages
   ```

2. Start a local server:
   ```bash
   python3 -m http.server 8000
   # Or with Node.js
   npx http-server -p 8000
   ```

3. Open http://localhost:8000 in your browser

### Deploy to GitHub Pages
1. Fork this repository
2. Go to Settings → Pages
3. Select "Deploy from a branch"
4. Choose `main` branch and `/ (root)`
5. Save and wait for deployment

### Deploy to GitLab Pages
The repository includes `.gitlab-ci.yml` for automatic deployment.

## 📦 Project Structure

```
linux-man-pages/
├── index.html          # Complete application
├── data/              # Search indexes and databases
│   ├── index.js       # Main search index
│   ├── tldr_index.js  # TLDR pages index
│   └── options.js     # Command options database
├── themes/            # 26 theme CSS files
├── man_pages/         # 9,371 man page files
│   └── [command].[section].txt
├── tldr_pages/        # TLDR summaries
│   ├── common/        # Cross-platform commands
│   └── linux/         # Linux-specific commands
└── scripts/           # Maintenance scripts
```

## 🔧 Development

### Prerequisites
- Python 3.x (for local server)
- Node.js (optional, for npm scripts)

### Adding New Man Pages
1. Add the `.txt` file to `man_pages/`
2. Update the search index:
   ```bash
   python3 scripts/update_index.py
   ```

### Creating New Themes
1. Create a new CSS file in `themes/`
2. Follow the existing theme structure
3. Add theme metadata to `index.html`

### Testing
```bash
# Install test dependencies
npm install puppeteer

# Run visual tests
node test_visual.js
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Guidelines
1. Maintain the self-contained nature (no external dependencies)
2. Test your changes locally
3. Follow existing code style
4. Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Linux man pages from the Linux Documentation Project
- TLDR pages from the tldr-pages project
- Theme inspirations from various popular editor themes
- Icons and emojis from standard Unicode sets

## 📊 Statistics

- **Total Size**: ~50MB (uncompressed)
- **Man Pages**: 9,371 commands
- **Themes**: 26 unique styles
- **Load Time**: < 1 second
- **Browser Support**: All modern browsers

## 🔗 Links

- [Live Demo](https://yourusername.github.io/linux-man-pages)
- [Report Issues](https://github.com/yourusername/linux-man-pages/issues)
- [Changelog](CHANGELOG.md)

---

Made with ❤️ for the Linux community