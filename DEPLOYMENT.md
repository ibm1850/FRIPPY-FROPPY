# Frippy Froppy - Deployment Guide

## 🚀 Quick Deploy to Render.com (FREE)

### Prerequisites:
1. Create a GitHub account at https://github.com
2. Create a Render account at https://render.com

### Step-by-Step Instructions:

#### 1. Install Git (if not already installed)
Download and install Git from: https://git-scm.com/download/win

#### 2. Initialize Git Repository
Open PowerShell in your project folder and run:
```powershell
cd c:\Users\PC\Downloads\f2\Perfect-Boss
git init
git add .
git commit -m "Initial commit - Frippy Froppy E-commerce"
```

#### 3. Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `frippy-froppy`
3. Make it **Public**
4. Click "Create repository"
5. Copy the repository URL (looks like: `https://github.com/YOUR_USERNAME/frippy-froppy.git`)

#### 4. Push to GitHub
```powershell
git remote add origin YOUR_GITHUB_URL
git branch -M main
git push -u origin main
```

#### 5. Deploy on Render
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select your `frippy-froppy` repository
5. Configure:
   - **Name**: `frippy-froppy`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Instance Type**: `Free`
6. Add Environment Variable:
   - Key: `NODE_ENV`
   - Value: `production`
7. Click "Create Web Service"

#### 6. Wait for Deployment
- Render will build and deploy your app (takes 5-10 minutes)
- You'll get a URL like: `https://frippy-froppy.onrender.com`

### 🎉 Your website will be LIVE!

---

## Alternative: Deploy to Railway.app

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect and deploy
6. Get your live URL!

---

## Important Notes:

⚠️ **Free Tier Limitations:**
- Site sleeps after 15 min of inactivity
- Takes ~30 seconds to wake up on first visit
- 750 hours/month limit on Render

💡 **For Production:**
Consider upgrading to paid hosting ($7-20/month) for:
- No sleep mode
- Custom domain
- Better performance
- More storage

---

## Need Help?
If you get stuck at any step, let me know which step and I'll help you troubleshoot!
