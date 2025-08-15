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

1. **Push to GitHub**: Ensure your code is pushed to a GitHub repository
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up or log in
   - Click "New Project"
   - Import your GitHub repository
3. **Configure Project**:
   - Vercel will automatically detect it's a Create React App
   - Set the root directory (usually auto-detected)
   - The build command is automatically set to `npm run build`
   - The output directory is automatically set to `build`
4. **Deploy**: Click "Deploy" and wait for the build to complete

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
