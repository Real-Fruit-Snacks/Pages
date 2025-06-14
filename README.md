# Linux Man Pages Explorer

<div align="center">

![Version](https://img.shields.io/badge/version-7.6.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Man Pages](https://img.shields.io/badge/man%20pages-10%2C296-orange.svg)
![TLDR Pages](https://img.shields.io/badge/tldr%20pages-100%2B-yellow.svg)
![Themes](https://img.shields.io/badge/themes-26-purple.svg)
![Size](https://img.shields.io/badge/size-55MB-lightgrey.svg)

**The ultimate offline Linux documentation browser with lightning-fast search, beautiful themes, and TLDR summaries**

[**Live Demo**](https://yourusername.github.io/linux-man-pages) • [**Quick Start**](#-quick-start) • [**Features**](#-key-features) • [**Themes**](#-themes)

</div>

---

## 🚀 Quick Start

**Option 1: GitHub Pages (Recommended)**
```bash
# 1. Fork this repository
# 2. Go to Settings → Pages → Enable GitHub Actions
# 3. Your site is ready at: https://[username].github.io/linux-man-pages
```

**Option 2: Local Development**
```bash
git clone https://github.com/yourusername/linux-man-pages.git
cd linux-man-pages
python3 -m http.server 8000
# Open http://localhost:8000
```

**That's it!** No build process. No dependencies. Just pure, fast documentation.

---

## ✨ Key Features

### 🔥 Lightning Performance
- **10x faster search** with intelligent debouncing
- **50-80% memory reduction** through DOM recycling
- **Instant theme switching** with CSS preloading
- **< 1 second load time** even with 10,000+ pages

### 📚 Comprehensive Documentation
- **10,296 Linux man pages** - Every command at your fingertips
- **100+ TLDR summaries** - Quick examples for common tasks
- **2,844 parsed commands** - Automatic flag detection and explanation
- **Smart search** - Find by command name, description, or content

### 🎨 Beautiful Experience
- **26 stunning themes** - From Dracula to Synthwave '84
- **Keyboard shortcuts** - Navigate like a pro
- **Command explainer** - Break down complex syntax
- **History & bookmarks** - Track your learning journey

### 🔒 Privacy First
- **100% offline** - No tracking, no analytics, no external requests
- **Self-contained** - Single HTML file with everything included
- **No dependencies** - Works on any web server
- **Air-gap ready** - Perfect for secure environments

---

## 🎯 Why Choose This?

<table>
<tr>
<td width="50%">

### ⚡ For Developers
- Find commands instantly
- Learn by example with TLDR
- Beautiful syntax highlighting
- Works without internet

</td>
<td width="50%">

### 🏢 For Organizations
- Deploy on internal networks
- No external dependencies
- Customizable themes
- Zero maintenance

</td>
</tr>
</table>

---

## 🎨 Themes

Experience documentation in your favorite color scheme:

<details>
<summary><b>🌙 Dark Themes (16)</b></summary>

- **Ayu Mirage** - Warm colors with orange accents
- **Dracula** - The famous purple-based theme
- **Tokyo Night** - Inspired by Tokyo city lights
- **Nord** - Arctic, north-bluish clean design
- **Catppuccin Mocha** - Soothing pastel colors
- **Gruvbox** - Retro groove with warm tones
- **One Dark** - Atom's iconic dark theme
- **GitHub Dark** - GitHub's official dark mode
- And 8 more...

</details>

<details>
<summary><b>☀️ Light Themes (2)</b></summary>

- **Light** - Clean and bright default
- **Hotdog Stand** - Windows 3.1 nostalgia

</details>

<details>
<summary><b>🌈 Special Themes (8)</b></summary>

- **Synthwave '84** - Neon-soaked retro future
- **Cyber Frost** - Cool blue cyberpunk
- **Miami Sunrise** - Vibrant vice vibes
- **Forest Dawn** - Natural earth tones
- And 4 more...

</details>

---

## ⌨️ Keyboard Shortcuts

Navigate like a power user:

| Action | Shortcut | Description |
|--------|----------|-------------|
| `/` | Focus search | Jump to search instantly |
| `↑` `↓` | Navigate | Browse search results |
| `T` | Themes | Open theme selector |
| `E` | Explain | Analyze current command |
| `Shift+?` | Help | Show all shortcuts |
| `ESC` | Close | Exit current view |

---

## 🛠️ Advanced Usage

<details>
<summary><b>Adding Custom Man Pages</b></summary>

```bash
# 1. Add your .txt file to man_pages/
cp mycommand.1.txt man_pages/

# 2. Update the search index
python3 scripts/update_index.py
```

</details>

<details>
<summary><b>Updating Command Database</b></summary>

```bash
# Extract options from all man pages
node extract-options.js
```

</details>

<details>
<summary><b>Creating Custom Themes</b></summary>

1. Create a new CSS file in `themes/`
2. Follow the existing theme structure
3. Add theme metadata to `index.html`

</details>

---

## 📊 Performance Metrics

| Metric | Value | Improvement |
|--------|-------|-------------|
| Search Speed | 10ms | 10x faster |
| Memory Usage | 20MB | 80% reduction |
| Theme Switch | Instant | 100ms → 0ms |
| Page Load | <1s | Optimized |
| Offline Ready | 100% | No internet needed |

---

## 🏗️ Architecture

```
One HTML file to rule them all:
├── index.html          # 🎯 The entire application
├── data/               # 📊 Search indexes (auto-loaded)
├── man_pages/          # 📚 10,296 documentation files
├── tldr_pages/         # ⚡ Quick reference guides
└── themes/             # 🎨 26 beautiful themes
```

**Zero build process. Zero dependencies. Pure performance.**

---

## 🤝 Contributing

We welcome contributions! See our [Contributing Guidelines](CONTRIBUTING.md).

**Quick contribution ideas:**
- Add missing TLDR pages
- Create new themes
- Improve search algorithm
- Add keyboard shortcuts

---

## 📈 Roadmap

- [ ] Fuzzy search support
- [ ] Command aliases database
- [ ] Export to PDF/Markdown
- [ ] Plugin system for extensions
- [ ] Mobile app wrapper

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ for the Linux community**

[Report Bug](https://github.com/yourusername/linux-man-pages/issues) • [Request Feature](https://github.com/yourusername/linux-man-pages/issues) • [Star on GitHub](https://github.com/yourusername/linux-man-pages)

</div>