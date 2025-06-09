# Linux Man Pages

A self-contained web application for searching and viewing Linux manual pages, designed for static hosting on GitHub Pages or GitLab Pages. Works completely offline after initial deployment.

## Features

- 🔍 **Fast Search**: Real-time search with suggestions as you type
- 📚 **Comprehensive Coverage**: 2,926 Linux man pages from sections 1-8
- 📋 **TLDR Integration**: Quick practical examples for each command
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 🚀 **Lazy Loading**: Man pages load on-demand for optimal performance
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🔒 **Self-Contained**: No external dependencies or API calls
- 💾 **Size Optimized**: Automatically splits data to respect hosting limits
- ⭐ **Bookmarks**: Save frequently used commands
- 🕐 **History**: Track recently viewed pages
- ⌨️ **Keyboard Navigation**: Full keyboard support for power users
- 🔎 **Full-Text Search**: Search within man page content (optional)

## Live Demo

- **GitHub Pages**: https://real-fruit-snacks.github.io/Pages/
- **GitLab Pages**: `https://[your-username].gitlab.io/[your-repo]/`

## Structure

```
.
├── index.html              # Complete web application
├── data/                   # Man page data
│   ├── index.js           # Search index (2,926 commands)
│   ├── man_1.js           # Man page content
│   └── manifest.js        # Data file listing
├── .github/               # GitHub Actions
│   └── workflows/
│       └── deploy-pages.yml
├── .gitlab-ci.yml         # GitLab CI/CD configuration
├── .nojekyll              # Disable Jekyll processing
├── README.md              # Documentation
├── LICENSE                # MIT License
└── package.json           # Package info (no dependencies needed)
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
5. **Keyboard Shortcuts**:
   - `/` - Focus search
   - `Escape` - Clear search or close man page
   - `↑/↓` - Navigate suggestions
   - `Ctrl+K` - Toggle dark mode

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
- **Performance**: Uses lazy loading to load only requested man pages
- **Search Index**: Pre-built index enables instant search without loading all data
- **Cross-Browser**: Compatible with all modern browsers
- **TLDR Data**: Cached in localStorage with 7-day expiration
- **Syntax Highlighting**: Man page content is enhanced with HTML formatting
- **Storage**: Uses localStorage for bookmarks, history, and preferences
- **Command Coverage**: 2,926 Linux man pages (comprehensive coverage)
- **Data Source**: Linux man-pages project + essential system utilities
- **Data Format**: Properly formatted man pages using standard man toolchain

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
- No external requests (except TLDR on first use)
- All data stored locally in browser
- No cookies required

## Known Limitations

- TLDR summaries require internet on first fetch (cached afterwards)
- Maximum 100MB per data file (GitLab Pages limit)
- Search limited to command names and descriptions

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