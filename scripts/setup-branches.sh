#!/bin/bash

# Professional CI/CD Branch Setup Script
# This script sets up the new branch structure for the professional deployment workflow

echo "🚀 Setting up professional CI/CD branch structure..."

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Ensure we're on main branch
if [ "$(git branch --show-current)" != "main" ]; then
    echo "⚠️  Warning: Not on main branch. Switching to main..."
    git checkout main
fi

# Pull latest changes
echo "📥 Pulling latest changes from main..."
git pull origin main

# Create dev2 branch
echo "🌿 Creating dev2 branch..."
git checkout -b dev2
git push origin dev2
echo "✅ dev2 branch created and pushed"

# Create dev branch
echo "🌿 Creating dev branch..."
git checkout -b dev
git push origin dev
echo "✅ dev branch created and pushed"

# Switch back to main
git checkout main

echo ""
echo "🎉 Branch setup complete!"
echo ""
echo "📋 Your new branch structure:"
echo "   main (production)"
echo "   ├── dev (staging)"
echo "   └── dev2 (development)"
echo ""
echo "📝 Next steps:"
echo "   1. Set up GitHub secrets for Vercel deployment"
echo "   2. Configure branch protection rules"
echo "   3. Test the workflow with a small change"
echo ""
echo "🔗 For detailed instructions, see DEPLOYMENT.md" 