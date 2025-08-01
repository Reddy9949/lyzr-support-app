# 🚀 Vercel Deployment Guide - Lyzr Support App

## 📋 Pre-Deployment Checklist

✅ **All files configured:**
- `vercel.json` - Vercel configuration
- `requirements.txt` - Python dependencies
- `client/package.json` - Updated with vercel-build script

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from project root:**
   ```bash
   cd lyzr-support-app
   vercel
   ```

4. **Follow the prompts:**
   - Project name: `lyzr-support-app`
   - Framework preset: `Other`
   - Build command: `cd client && npm run vercel-build`
   - Output directory: `client/dist`

### Option 2: Deploy via GitHub + Vercel Dashboard

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure build settings (see below)

## ⚙️ Vercel Project Settings

### Build & Development Settings:
- **Framework Preset:** `Other`
- **Build Command:** `cd client && npm run vercel-build`
- **Output Directory:** `client/dist`
- **Install Command:** `cd client && npm install`

### Environment Variables:
Add these in Vercel Dashboard → Settings → Environment Variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=https://your-vercel-app.vercel.app

# Backend Configuration (Optional - for when you get Lyzr API key)
LYZR_API_KEY=your-lyzr-api-key-when-available
LYZR_API_URL=https://api.lyzr.ai

# Database Configuration
DATABASE_URL=your-supabase-database-url
```

## 🎯 What Will Work After Deployment

### ✅ **Fully Functional Features:**
- **Frontend:** Complete React app with beautiful UI
- **Authentication:** Supabase login/signup
- **Dashboard:** Agent creation and management
- **Widget Generation:** Copy-paste embed codes
- **Ticket Management:** Full CRUD operations
- **Analytics:** Performance monitoring
- **Support Pages:** FAQ, contact, resources

### 🔄 **Development Mode Features:**
- **Chat Responses:** Mock/demo responses (until Lyzr API key added)
- **Agent Creation:** Works with fallback system
- **All UI/UX:** Fully functional and professional

## 🔧 Post-Deployment Steps

### 1. **Update API URLs:**
After deployment, update your environment variables:
```bash
VITE_API_URL=https://your-actual-vercel-url.vercel.app
```

### 2. **Configure Supabase:**
- Add your Vercel domain to Supabase allowed origins
- Update redirect URLs in Supabase auth settings

### 3. **Test Everything:**
- Sign up/login flow
- Agent creation
- Widget embedding
- Chat functionality (with demo responses)

### 4. **Add Lyzr API Key (When Ready):**
- Get API key from Lyzr platform
- Add to Vercel environment variables
- Redeploy → Live AI responses! 🎉

## 🌐 Expected URLs After Deployment

- **Main App:** `https://your-app-name.vercel.app`
- **API Endpoints:** `https://your-app-name.vercel.app/api/*`
- **Widget:** `https://your-app-name.vercel.app/widget/*`

## 🎉 Ready to Deploy!

Your Lyzr Support App is **100% ready** for Vercel deployment. Everything will work perfectly, and you'll have a live, professional AI support platform running in minutes!

## 🆘 Troubleshooting

### Common Issues:
1. **Build fails:** Check that all dependencies are in client/package.json
2. **API not working:** Verify environment variables are set
3. **Supabase errors:** Check CORS settings and redirect URLs

### Support:
- Check Vercel deployment logs
- Verify environment variables
- Test locally first with `npm run build`

---

**Ready to go live? Run `vercel` in your project directory!** 🚀
