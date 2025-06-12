# Linux Man Pages

A fully self-contained, offline-capable web application for searching and viewing Linux manual pages. Designed for static hosting on GitHub Pages, GitLab Pages, or any web server. No internet connection required after deployment - all data is included!

## Project Structure

```
.
├── index.html          # Complete application (HTML + CSS + JS)
├── data/               # Search indexes
├── themes/             # Theme CSS files
├── man_pages/          # Man page content files
├── tldr_pages/         # TLDR summaries
├── docs/               # Documentation
└── tests/              # Test scripts
```

## Features

- 🔍 **Fast Search**: Real-time search with suggestions as you type
- 📚 **Comprehensive Coverage**: 8,121 Linux man pages from official sources
- 📋 **TLDR Integration**: Quick practical examples included locally
- 🎨 **16 Beautiful Themes**: Including Dark, Ocean Depth, Dracula, Monokai, and more
- 🚀 **Instant Loading**: All data stored locally for blazing-fast performance
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🔒 **100% Offline**: No external dependencies, CDNs, or API calls
- 💾 **Optimized Storage**: Efficient data structure respects hosting limits
- ⭐ **Bookmarks**: Save frequently used commands
- 🕐 **History**: Track recently viewed pages
- ⌨️ **Keyboard Navigation**: Full keyboard support for power users
- 🌐 **No Internet Required**: Works completely offline after deployment
- 🔧 **Command Explainer**: Interactive breakdown of complex Linux commands (Press 'E' key)

## Live Demo

- **GitHub Pages**: https://real-fruit-snacks.github.io/Pages/
- **GitLab Pages**: `https://[your-username].gitlab.io/[your-repo]/`

## What's Included

```
├── index.html             # Complete web application
├── data/                  # Application data
│   ├── index.js          # Search index (8,121 commands)
│   ├── tldr_index.js     # TLDR pages index
│   └── options.js        # Command options database
├── themes/                # 16 modular theme CSS files
│   ├── ocean-depth.css   # Default theme
│   ├── dark.css          
│   ├── solarized-dark.css
│   ├── dracula.css       
│   ├── monokai.css       
│   ├── high-contrast.css 
│   └── ...               # And 10 more themes
├── man_pages/             # 8,121 man page files
│   └── [command].[section].txt
├── tldr_pages/            # TLDR summaries
│   ├── common/           # Cross-platform commands
│   └── linux/            # Linux-specific commands
├── docs/                  # Documentation
├── extract-options.js     # Options extractor script
├── .github/               # GitHub Actions
├── .gitlab-ci.yml         # GitLab CI/CD
├── .nojekyll             # GitHub Pages config
├── package.json          # Node.js config
└── README.md             # This file
```

## Deployment

### GitHub Pages (Automatic)

1. Push to GitHub
2. Go to Settings → Pages
3. Under "Build and deployment", select "GitHub Actions"
4. The included workflow will deploy automatically
5. Access at: `https://[username].github.io/[repo-name]/`

### GitLab Pages (Automatic)

1. Push to GitLab
2. GitLab CI/CD automatically deploys via `.gitlab-ci.yml`
3. Access at: `https://[username].gitlab.io/[repo-name]/`

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Real-Fruit-Snacks/Pages.git
cd Pages

# For local testing
python3 -m http.server 8000
# Visit http://localhost:8000
```

## Installation

### Option 1: Use Pre-built Release

Download the latest release from [GitHub Releases](https://github.com/Real-Fruit-Snacks/Pages/releases):

```bash
# Download and extract the latest version
wget https://github.com/Real-Fruit-Snacks/Pages/releases/latest/download/linux-man-pages.tar.gz
tar -xzf linux-man-pages.tar.gz
cd linux-man-pages

# Deploy to your server or Git repository
```

### Option 2: Clone Repository

```bash
git clone https://github.com/Real-Fruit-Snacks/Pages.git
cd Pages
```

### Option 3: Fork for Customization

1. Fork this repository on GitHub/GitLab
2. Customize as needed
3. Deploy automatically via Pages

## Usage

1. **Search**: Start typing a command name or description
2. **Filter**: Use the dropdown to filter by section
3. **Navigate**: 
   - Click suggestions or press Enter to view
   - Use arrow keys to navigate suggestions
   - Press Escape to close
4. **TLDR**: Click the 📋 button to jump to quick examples
5. **Themes**: Click the theme toggle (🌙) in the top-left corner
6. **Keyboard Shortcuts**:
   - `/` - Focus search
   - `Escape` - Clear search or close man page
   - `↑/↓` - Navigate suggestions

## Available Themes

16 beautiful themes to choose from:
- **Ocean Depth** (Default) - Deep blue oceanic theme
- **Dark** - Classic dark theme with blue accents
- **Solarized Dark** - Popular color scheme for reduced eye strain
- **Dracula** - Purple-accented dark theme
- **Monokai** - Classic code editor theme
- **High Contrast** - Accessibility-focused with maximum contrast
- **Nord** - Arctic, north-bluish clean theme
- **Gruvbox** - Retro groove theme with warm colors
- **Tokyo Night** - Modern Japanese-inspired theme
- **One Dark** - Atom's iconic dark theme
- **Neon Noir** - Cyberpunk-inspired with neon accents
- **Forest Dawn** - Nature-inspired green theme
- **Cyber Frost** - Cool blue with tech aesthetics
- **Retro Wave** - 80s synthwave inspired
- **Miami Sunrise** - Vibrant tropical colors
- **Flat Light** - Clean, minimalist light theme

## Man Page Sections

- **Section 1**: User commands (ls, grep, find, etc.)
- **Section 2**: System calls (open, read, write, etc.)
- **Section 3**: Library functions (printf, malloc, etc.)
- **Section 5**: File formats (passwd, fstab, etc.)
- **Section 7**: Miscellaneous (ascii, regex, etc.)
- **Section 8**: System administration (sudo, mount, etc.)

## Command Categories

The application includes comprehensive coverage of Linux commands:

- **System Administration**: systemctl, journalctl, passwd, visudo, modprobe, systemd-analyze
- **Text Processing**: grep, sed, awk, tr, paste, join, iconv
- **Network Tools**: netstat, ss, ip, ethtool, tcpdump, nmap, socat
- **Development Tools**: gcc, make, git, docker, rustc, cargo, java, python3
- **Package Management**: apt, dpkg, rpm, pip3, gem, composer
- **File Management**: ls, find, rsync, tar, zip, chmod, chown, setfacl
- **System Monitoring**: top, htop, ps, vmstat, iostat, sar, glances, btop
- **Security Tools**: ssh, gpg, openssl, iptables, semanage, aa-status, pwgen

## Technical Details

- **File Size Management**: Automatically splits data into multiple files under 80MB each
- **Performance**: Instant loading with pre-processed local data
- **Search Index**: Pre-built index enables instant search without loading all data
- **Cross-Browser**: Compatible with all modern browsers
- **TLDR Data**: Stored locally, no caching needed
- **Syntax Highlighting**: Man page content is enhanced with HTML formatting
- **Storage**: Uses localStorage for bookmarks, history, and preferences
- **Command Coverage**: 7,897 Linux man pages from official sources
- **TLDR Coverage**: Comprehensive TLDR pages for common and Linux-specific commands
- **Theme System**: Modular CSS architecture with 5 built-in themes
- **Data Format**: Pre-processed text files for instant loading
- **Search Performance**: No limit on search results displayed

## Browser Support

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Performance

- **Initial load**: ~450KB total
- **Search response**: <50ms
- **Man page load**: <100ms
- **Memory usage**: ~15MB

## Privacy

- No analytics or tracking
- No external requests whatsoever
- All data stored locally in browser
- No cookies required
- Works in private/incognito mode

## Offline Capability

This application is **100% offline-capable**. All resources are included:
- ✅ All man pages stored locally in `man_pages/` directory
- ✅ All TLDR summaries stored locally in `tldr_pages/` directory  
- ✅ All themes stored locally in `themes/` directory
- ✅ No external CDNs or API calls
- ✅ No internet connection required after deployment

## Known Limitations

- Maximum 100MB per file (GitHub/GitLab Pages limit)
- Search shows all matching results without pagination
- Search limited to command names and descriptions (not full-text)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Note: Linux manual pages are sourced from the official Linux man-pages project and remain under their original licenses.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Ways to Contribute

- Report bugs or request features
- Improve documentation
- Add missing commands
- Enhance UI/UX
- Add language translations

### Development Setup

```bash
# Fork and clone
git clone https://github.com/[your-username]/Pages.git
cd Pages

# Test locally
python3 -m http.server 8000

# Make changes and test
# Submit pull request
```

## Acknowledgments

- Linux manual pages from various distributions
- [TLDR Pages](https://github.com/tldr-pages/tldr) community
- Icons from Unicode emoji set
- Inspired by Unix philosophy: do one thing well

---

**Built with ❤️ for the Linux community**

*Making man pages accessible to everyone, everywhere.*