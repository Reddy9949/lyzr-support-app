# 🚀 Lyzr Support App - Deployment Guide

This guide will walk you through deploying your Lyzr Support App to production.

## 📋 Prerequisites

- **Supabase Account**: [supabase.com](https://supabase.com) (free tier available)
- **Vercel Account**: [vercel.com](https://vercel.com) (free tier available)
- **Railway/Render Account**: [railway.app](https://railway.app) or [render.com](https://render.com)
- **Lyzr API Access**: Contact Lyzr team for API keys

## 🏗️ Phase 1: Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `lyzr-support-app`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users

### 2. Set Up Database Tables

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Agents table
CREATE TABLE agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  tone TEXT NOT NULL,
  personality TEXT NOT NULL,
  knowledge_base TEXT[] DEFAULT '{}',
  lyzr_agent_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tickets table
CREATE TABLE tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES agents(id),
  question TEXT NOT NULL,
  user_session TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  confidence_score FLOAT,
  manual_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat sessions table
CREATE TABLE chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES agents(id),
  user_session TEXT NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  confidence_score FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for agents
CREATE POLICY "Users can view their own agents" ON agents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own agents" ON agents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agents" ON agents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agents" ON agents
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for tickets
CREATE POLICY "Users can view tickets for their agents" ON tickets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.id = tickets.agent_id 
      AND agents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert tickets" ON tickets
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update tickets for their agents" ON tickets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.id = tickets.agent_id 
      AND agents.user_id = auth.uid()
    )
  );

-- Policies for chat_sessions
CREATE POLICY "Users can view chat sessions for their agents" ON chat_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.id = chat_sessions.agent_id 
      AND agents.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert chat sessions" ON chat_sessions
  FOR INSERT WITH CHECK (true);
```

### 3. Create Storage Bucket

1. Go to Storage in your Supabase dashboard
2. Click "Create a new bucket"
3. Name it `knowledge-base`
4. Set it as public (for file access)

### 4. Get Supabase Credentials

1. Go to Settings → API
2. Copy your:
   - **Project URL**
   - **Anon Key**

## 🎯 Phase 2: Backend Deployment (Railway/Render)

### Option A: Railway Deployment

1. **Connect Repository**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Initialize project
   railway init
   ```

2. **Configure Environment Variables**
   ```bash
   railway variables set LYZR_API_KEY=your_lyzr_api_key
   railway variables set LYZR_API_URL=https://api.lyzr.ai
   railway variables set DATABASE_URL=your_supabase_database_url
   ```

3. **Deploy**
   ```bash
   railway up
   ```

### Option B: Render Deployment

1. **Connect Repository**
   - Go to [render.com](https://render.com)
   - Click "New Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `lyzr-support-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Set Environment Variables**
   ```
   LYZR_API_KEY=your_lyzr_api_key
   LYZR_API_URL=https://api.lyzr.ai
   DATABASE_URL=your_supabase_database_url
   ```

## 🌐 Phase 3: Frontend Deployment (Vercel)

### 1. Prepare Frontend

1. **Update Environment Variables**
   Create `client/.env.production`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=https://your-backend-url.com
   ```

2. **Update API URLs**
   - Replace all `http://localhost:8000` with your backend URL
   - Update widget configuration

### 2. Deploy to Vercel

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build**
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Set Environment Variables**
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=https://your-backend-url.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

## 🎨 Phase 4: Widget Deployment (CDN)

### 1. Build Widget

```bash
cd widget
npm run build
```

### 2. Deploy to CDN

**Option A: Vercel (Recommended)**
1. Create a new Vercel project for the widget
2. Set root directory to `widget`
3. Deploy

**Option B: GitHub Pages**
1. Push widget build to GitHub
2. Enable GitHub Pages
3. Set source to `/docs` or `/dist`

**Option C: Netlify**
1. Drag and drop the `widget/dist` folder to Netlify
2. Get your CDN URL

### 3. Update Widget URLs

Update all widget references to use your CDN URL:
```html
<script src="https://your-widget-cdn.com/lyzr-support-widget.js" agent-id="agent_0001"></script>
```

## 🔧 Phase 5: Production Configuration

### 1. Update CORS Settings

In your backend `main.py`, update CORS origins:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend-domain.vercel.app",
        "https://your-widget-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Set Up Custom Domain (Optional)

1. **Frontend**: Configure custom domain in Vercel
2. **Backend**: Configure custom domain in Railway/Render
3. **Widget**: Configure custom domain in your CDN

### 3. SSL/HTTPS

All platforms (Vercel, Railway, Render) provide SSL certificates automatically.

## 📊 Phase 6: Monitoring & Analytics

### 1. Set Up Monitoring

**Vercel Analytics**
- Enable in your Vercel project settings
- Track frontend performance

**Backend Monitoring**
- Railway: Built-in monitoring
- Render: Built-in monitoring
- Add custom logging for API calls

### 2. Error Tracking

**Sentry Integration**
```bash
# Install Sentry
npm install @sentry/react @sentry/tracing

# Configure in your app
import * as Sentry from "@sentry/react";
Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production"
});
```

## 🔐 Phase 7: Security Checklist

- [ ] **Environment Variables**: All secrets properly set
- [ ] **CORS**: Only allow necessary origins
- [ ] **Rate Limiting**: Implement API rate limiting
- [ ] **Input Validation**: All user inputs validated
- [ ] **HTTPS**: All endpoints use HTTPS
- [ ] **Database Security**: RLS policies configured
- [ ] **API Keys**: Securely stored and rotated

## 🚀 Phase 8: Go Live!

### 1. Final Testing

- [ ] Test user registration/login
- [ ] Test agent creation
- [ ] Test file uploads
- [ ] Test chat functionality
- [ ] Test ticket creation
- [ ] Test widget embedding

### 2. Update Documentation

Update your README with:
- Live app URL
- API documentation URL
- Widget usage examples
- Deployment architecture

### 3. Launch Checklist

- [ ] **Frontend**: https://your-app.vercel.app ✅
- [ ] **Backend**: https://your-api.railway.app ✅
- [ ] **Widget**: https://your-widget-cdn.com ✅
- [ ] **Database**: Supabase project configured ✅
- [ ] **Monitoring**: Analytics and error tracking ✅
- [ ] **Documentation**: Updated with live URLs ✅

## 🎯 Production URLs

After deployment, you should have:

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-api.railway.app`
- **Widget**: `https://your-widget-cdn.com`
- **API Docs**: `https://your-api.railway.app/docs`

## 📈 Scaling Considerations

### Frontend (Vercel)
- Automatic scaling
- Global CDN
- Edge functions for API routes

### Backend (Railway/Render)
- Auto-scaling based on traffic
- Database connection pooling
- Caching with Redis (optional)

### Database (Supabase)
- Automatic backups
- Connection pooling
- Real-time subscriptions

## 🔄 Continuous Deployment

Set up GitHub Actions for automatic deployment:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS configuration in backend
   - Verify frontend URL is in allowed origins

2. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check Supabase connection limits

3. **Widget Not Loading**
   - Verify CDN URL is accessible
   - Check browser console for errors

4. **File Upload Failures**
   - Verify Supabase storage bucket permissions
   - Check file size limits

### Support Resources

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Railway**: [railway.app/support](https://railway.app/support)
- **Supabase**: [supabase.com/support](https://supabase.com/support)
- **Lyzr**: Contact Lyzr team for API support

---

**🎉 Congratulations! Your Lyzr Support App is now live in production!** 