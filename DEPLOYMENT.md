# Professional CI/CD Deployment Guide

## Overview

This project uses a professional multi-environment CI/CD pipeline with three deployment stages:

- **Dev2** → Development testing environment
- **Dev** → Staging environment  
- **Main** → Production environment

## Branch Strategy

### Branch Structure
```
main (production)
├── dev (staging)
    └── dev2 (development)
        └── feature branches
```

### Branch Purposes

1. **dev2** - Development Testing
   - For initial feature development and testing
   - Deploys to Vercel preview environment
   - Quick iterations and bug fixes

2. **dev** - Staging Environment
   - Contains all working features from dev2
   - Final testing before production
   - Deploys to Vercel preview environment
   - Only merge when features are stable

3. **main** - Production Environment
   - Live production deployment
   - Only merge from dev when everything is tested
   - Deploys to Vercel production environment

## Workflow Process

### 1. Feature Development (dev2)
```bash
# Create feature branch from dev2
git checkout dev2
git pull origin dev2
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to dev2 for testing
git push origin feature/new-feature
# Create PR to dev2
```

### 2. Development Testing (dev2 → dev)
```bash
# After testing in dev2, merge to dev
git checkout dev
git pull origin dev
git merge dev2
git push origin dev
# This triggers deployment to staging environment
```

### 3. Production Deployment (dev → main)
```bash
# After thorough testing in dev, merge to main
git checkout main
git pull origin main
git merge dev
git push origin main
# This triggers production deployment
```

## Environment Variables

### Required Secrets (GitHub Repository Settings)

1. **Vercel Configuration**
   - `VERCEL_TOKEN` - Your Vercel API token
   - `VERCEL_ORG_ID` - Your Vercel organization ID
   - `VERCEL_PROJECT_ID` - Your Vercel project ID

2. **Application Environment Variables**
   - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

3. **Optional Notifications**
   - `SLACK_WEBHOOK_URL` - Slack webhook for deployment notifications

### Setting Up Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add each secret with the appropriate value

## Deployment Environments

### Dev2 Environment
- **Purpose**: Initial development and testing
- **URL**: Vercel preview deployment
- **Deployment Trigger**: Push to `dev2` branch
- **Use Case**: Quick feature testing and bug fixes

### Dev Environment (Staging)
- **Purpose**: Pre-production testing
- **URL**: Vercel preview deployment
- **Deployment Trigger**: Push to `dev` branch
- **Use Case**: Final testing before production

### Production Environment
- **Purpose**: Live production site
- **URL**: Your main Vercel deployment
- **Deployment Trigger**: Push to `main` branch
- **Use Case**: Live user-facing application

## CI/CD Pipeline Jobs

### 1. Quality & Security Checks
- ESLint code linting
- TypeScript type checking
- Security audit (moderate level)
- Vulnerability scanning (high level)

### 2. Build and Test
- Dependency installation
- Application build
- Environment variable validation

### 3. Environment-Specific Deployments
- **Dev2**: Preview deployment for development
- **Dev**: Preview deployment for staging
- **Main**: Production deployment

### 4. Pull Request Checks
- Runs on all PRs to main, dev, and dev2
- Ensures code quality before merging

### 5. Deployment Notifications
- Optional Slack notifications for production deployments

## Best Practices

### Code Quality
1. **Always run tests locally before pushing**
   ```bash
   npm run lint
   npm run build
   ```

2. **Use meaningful commit messages**
   ```bash
   git commit -m "feat: add user authentication"
   git commit -m "fix: resolve navigation bug"
   git commit -m "docs: update README"
   ```

3. **Keep branches up to date**
   ```bash
   git checkout dev2
   git pull origin dev2
   git checkout your-feature-branch
   git rebase dev2
   ```

### Deployment Safety
1. **Never push directly to main**
   - Always go through dev → main workflow
   - Use pull requests for code review

2. **Test thoroughly in dev environment**
   - Verify all features work correctly
   - Check for performance issues
   - Test with real data

3. **Monitor deployments**
   - Check Vercel deployment logs
   - Verify environment variables
   - Test functionality after deployment

### Emergency Procedures
1. **Hotfix for production**
   ```bash
   git checkout main
   git checkout -b hotfix/critical-fix
   # Make minimal fix
   git commit -m "hotfix: critical production issue"
   git push origin hotfix/critical-fix
   # Create PR directly to main
   ```

2. **Rollback procedure**
   ```bash
   git checkout main
   git revert <commit-hash>
   git push origin main
   ```

## Monitoring and Alerts

### Vercel Monitoring
- Monitor deployment success/failure
- Check build logs for errors
- Verify environment variables

### Performance Monitoring
- Monitor Core Web Vitals
- Check for build size increases
- Monitor API response times

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check for TypeScript errors
   - Verify all dependencies are installed
   - Check environment variables

2. **Deployment Failures**
   - Verify Vercel configuration
   - Check secret values
   - Review build logs

3. **Environment Variable Issues**
   - Ensure all required secrets are set
   - Check variable names match exactly
   - Verify values are correct

### Getting Help
1. Check GitHub Actions logs
2. Review Vercel deployment logs
3. Verify environment configuration
4. Test locally with same environment variables

## Migration from Current Setup

If you're migrating from a simpler setup:

1. **Create new branches**
   ```bash
   git checkout -b dev2
   git push origin dev2
   git checkout -b dev
   git push origin dev
   ```

2. **Update branch protection rules**
   - Protect main branch (require PR)
   - Protect dev branch (require PR)
   - Allow direct pushes to dev2 for quick testing

3. **Update Vercel project settings**
   - Configure preview deployments
   - Set up environment variables for each environment

4. **Test the workflow**
   - Make a small change to dev2
   - Verify deployment works
   - Test the full dev2 → dev → main flow 