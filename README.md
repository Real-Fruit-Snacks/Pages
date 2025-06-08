# Linux Man Pages

A self-contained web application for searching and viewing Linux manual pages, designed for static hosting on GitHub Pages or GitLab Pages.

## Features

- 🔍 **Fast Search**: Real-time search with suggestions as you type
- 📚 **Comprehensive Coverage**: 321 man pages from sections 1-8
- 📋 **TLDR Integration**: Quick practical examples for each command
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 🚀 **Lazy Loading**: Man pages load on-demand for optimal performance
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🔒 **Self-Contained**: No external dependencies or API calls
- 💾 **Size Optimized**: Automatically splits data to respect hosting limits
- ⭐ **Bookmarks**: Save frequently used commands
- 🕐 **History**: Track recently viewed pages
- ⌨️ **Keyboard Navigation**: Full keyboard support for power users

## Demo

Visit the live site: `https://[your-username].gitlab.io/[your-repo]/`

## Structure

```
.
├── index.html              # Main application
├── build_man_pages.sh      # Build script (for development)
├── .gitlab-ci.yml          # GitLab Pages configuration
├── README.md               # This file
└── data/                   # Generated man page data
    ├── manifest.js         # List of data files
    ├── index.js            # Search index
    └── man_*.js            # Man page content (split into chunks)
```

## Deployment

### GitLab Pages

1. Push this repository to GitLab
2. GitLab will automatically deploy using `.gitlab-ci.yml`
3. Access your site at `https://[username].gitlab.io/[repo-name]/`

### GitHub Pages

1. Push this repository to GitHub
2. Go to Settings → Pages
3. Select "Deploy from a branch"
4. Choose your branch (main/master) and root folder
5. Access your site at `https://[username].github.io/[repo-name]/`

## Development

### Prerequisites

- Python 3 (for local development server)
- Node.js (optional, for running tests)
- Linux/Unix system with man pages installed

### Local Development

```bash
# Start local server
python3 -m http.server 8000

# Visit http://localhost:8000
```

### Building Man Pages

To update the man pages with content from your Linux system:

```bash
# Make the script executable
chmod +x build_man_pages.sh

# Run the build script
./build_man_pages.sh

# Add additional commands
./add_more_commands.sh              # Essential commands
./add_essential_modern_commands.sh  # Modern tools (docker, kubectl, etc.)

# Commit and push the changes
git add .
git commit -m "Update man pages"
git push
```

### Testing

```bash
# Install dependencies
npm install

# Run tests
node test_comprehensive_navigation.js
```

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

## Technical Details

- **File Size Management**: Automatically splits data into multiple files under 80MB each
- **Performance**: Uses lazy loading to load only requested man pages
- **Search Index**: Pre-built index enables instant search without loading all data
- **Cross-Browser**: Compatible with all modern browsers
- **TLDR Data**: Cached in localStorage with 7-day expiration
- **Syntax Highlighting**: Man page content is enhanced with HTML formatting
- **Storage**: Uses localStorage for bookmarks, history, and preferences

## Known Issues

- **Browser Cache**: After updates, users may need to clear cache or hard refresh (Ctrl+F5)
- **TLDR External Fetch**: Currently fetches TLDR data from GitHub (violates self-contained principle)

## Roadmap

- [ ] Bundle TLDR data during build process
- [ ] Add offline support with service worker
- [ ] Multi-language support for TLDR summaries
- [ ] Export/import bookmarks functionality
- [ ] Command cheat sheet generator

## License

This project aggregates Linux manual pages which are available under various open source licenses. The web interface code is provided as-is for educational purposes.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Adding New Commands

1. Add the command to the appropriate script in the root directory
2. Run the script to generate the man page data
3. Test the changes locally
4. Submit a pull request

### Reporting Issues

Please include:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

---

Built with ❤️ for the Linux community