# Deployment Guide

This application can be deployed to both GitLab Pages and GitHub Pages.

## 🚀 GitHub Pages Deployment

### Automatic Deployment (Recommended)

1. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Under "Build and deployment", select "GitHub Actions"
   - The included workflow will automatically deploy on push to main

2. **Access your site**:
   - URL: `https://[username].github.io/[repository-name]/`
   - Deployment typically takes 2-5 minutes

### Manual Deployment

1. Go to Settings → Pages
2. Under "Source", select "Deploy from a branch"
3. Choose "main" branch and "/ (root)" folder
4. Click Save
5. Access at: `https://[username].github.io/[repository-name]/`

## 🦊 GitLab Pages Deployment

### Automatic Deployment

The included `.gitlab-ci.yml` file enables automatic deployment:

1. Push code to GitLab repository
2. GitLab CI/CD automatically builds and deploys
3. Access at: `https://[username].gitlab.io/[repository-name]/`

### Configuration

No additional configuration needed! The `.gitlab-ci.yml` handles:
- Creating the required `public` directory
- Copying all necessary files
- Deploying on push to main/master branch

## 📦 Offline Deployment

For isolated networks without CI/CD:

1. Download the repository or release package
2. Upload files to your web server
3. Ensure the following structure:
   ```
   /
   ├── index.html
   ├── data/
   │   ├── index.js
   │   ├── man_1.js
   │   └── manifest.js
   └── (other files optional)
   ```

## 🔧 Custom Domain

### GitHub Pages Custom Domain
1. Create a `CNAME` file with your domain
2. Configure DNS to point to GitHub Pages
3. Enable HTTPS in repository settings

### GitLab Pages Custom Domain
1. Go to Settings → Pages
2. Add your custom domain
3. Configure DNS as instructed
4. Enable Force HTTPS

## 📝 Notes

- No build process required - pure static files
- All JavaScript and CSS are inline in `index.html`
- Data files must be accessible at `/data/` path
- Works with any static file server

## 🐛 Troubleshooting

**Page not loading?**
- Check if deployment is complete (2-5 minutes)
- Verify repository is public (for GitHub Pages)
- Clear browser cache

**404 errors on data files?**
- Ensure `data/` directory is included
- Check file paths are relative
- Verify no `.gitignore` is blocking data files

**TLDR not working?**
- Currently fetches from GitHub
- Will show "not available" if blocked
- Future versions will include bundled TLDR data