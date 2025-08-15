# Vercel Deployment Guide for RBF Calculator

## Best Deployment Approach

For the Revenue Based Finance (RBF) Calculator, the easiest and most efficient deployment method is using Vercel's GitHub integration with automatic deployments. Vercel has native support for Create React App, which this application is built with.

## Vercel Configuration

Create a `vercel.json` file in the root of your project with the following content:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "github": {
    "silent": true
  }
}
```

This configuration:

- Uses Vercel's static build runtime optimized for Create React App
- Sets the correct distribution directory (build)
- Handles client-side routing by redirecting all routes to index.html
- Enables silent GitHub deployments (no commit comments)

## Deployment Process

### 1. Create .gitignore File

Before adding files to your repository, create a `.gitignore` file in the root of your project with the following content:

```gitignore
# macOS
.DS_Store
.AppleDouble
.LSOverride
Icon
._*
.Spotlight-V100
.Trashes
.AppleDB
.AppleDesktop
Network Trash Folder
Temporary Items
.apdisk

# Windows
Thumbs.db
ehthumbs.db
Desktop.ini
$RECYCLE.BIN/
*.cab
*.msi
*.msix
*.msm
*.msp
*.lnk

# VS Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
*.code-workspace

# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json
yarn.lock

# Build outputs
/build
/dist

# Test coverage
/coverage

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Log files
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor files
*.swp
*.swo
*~
*.sublime-project
*.sublime-workspace

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
```

### 2. Initialize Git Repository and Push to GitHub

If you haven't already set up Git for your project, follow these steps:

1. **Initialize Git repository** (if not already done):

   ```bash
   git init
   ```

2. **Add all files to the repository**:

   ```bash
   git add .
   ```

3. **Make your first commit**:

   ```bash
   git commit -m "Initial commit"
   ```

4. **Set the main branch**:

   ```bash
   git branch -M main
   ```

5. **Add your GitHub remote repository**:

   ```bash
   git remote add origin https://github.com/because-international/rbf-loan-calculator.git
   ```

6. **Push to GitHub**:

   ```bash
   git push -u origin main
   ```

### 3. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect it's a Create React App
6. Set the root directory (usually auto-detected)
7. The build command is automatically set to `npm run build`
8. The output directory is automatically set to `build`
9. Click "Deploy" and wait for the build to complete

## Optimization Recommendations

1. **Environment Variables**: If you add any API keys or configuration in the future, use Vercel's environment variables feature
2. **Caching**: Vercel automatically handles asset caching for optimal performance
3. **Domain**: Add a custom domain through the Vercel dashboard when ready

## Local Testing (Optional)

For local testing of the Vercel deployment process:

1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts to link to your Vercel account
4. Test deployment with `vercel dev`

## Benefits of This Approach

- **Zero Configuration**: Vercel automatically detects Create React App settings
- **Automatic Deployments**: Every GitHub push triggers a new deployment
- **Preview Deployments**: Each pull request gets a unique preview URL
- **Global CDN**: Fast worldwide performance
- **Free SSL**: Automatic HTTPS for all deployments
- **Zero Cost**: Completely free for this application's needs
