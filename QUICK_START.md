# Quick Start: Professional CI/CD Workflow

## 🚀 Setup (One-time)

1. **Run the setup script:**
   ```bash
   ./scripts/setup-branches.sh
   ```

2. **Set up GitHub Secrets:**
   - Go to your repo → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `VERCEL_TOKEN`
     - `VERCEL_ORG_ID` 
     - `VERCEL_PROJECT_ID`
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📋 Daily Workflow

### 1. Feature Development (dev2)
```bash
git checkout dev2
git pull origin dev2
git checkout -b feature/my-feature

# Make changes...
git add .
git commit -m "feat: add new feature"
git push origin feature/my-feature

# Create PR to dev2
```

### 2. Testing & Staging (dev2 → dev)
```bash
# After testing in dev2, merge to dev
git checkout dev
git pull origin dev
git merge dev2
git push origin dev
```

### 3. Production (dev → main)
```bash
# After thorough testing in dev
git checkout main
git pull origin main
git merge dev
git push origin main
```

## 🔄 Workflow Summary

```
Feature Branch → dev2 → dev → main
     ↓           ↓      ↓      ↓
   Testing   Dev Test Staging Production
```

## ⚡ Quick Commands

### Check current branch
```bash
git branch --show-current
```

### Switch to dev2 for quick testing
```bash
git checkout dev2
git pull origin dev2
```

### Deploy to staging
```bash
git checkout dev
git merge dev2
git push origin dev
```

### Deploy to production
```bash
git checkout main
git merge dev
git push origin main
```

## 🛡️ Safety Rules

- ✅ **dev2**: Quick testing and development
- ✅ **dev**: Stable features ready for staging
- ✅ **main**: Production-ready code only
- ❌ **Never push directly to main**
- ❌ **Never merge broken code to dev**

## 📊 Environment URLs

- **Dev2**: Vercel preview deployment
- **Dev**: Vercel preview deployment  
- **Production**: Your main Vercel URL

## 🆘 Emergency

### Hotfix to production
```bash
git checkout main
git checkout -b hotfix/critical-fix
# Make minimal fix
git commit -m "hotfix: critical issue"
git push origin hotfix/critical-fix
# Create PR to main
```

### Rollback
```bash
git checkout main
git revert <commit-hash>
git push origin main
```

## 📖 Full Documentation

See `DEPLOYMENT.md` for complete details and troubleshooting. 