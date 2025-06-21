# 🚀 DocDigest Deployment Guide

This guide will help you deploy DocDigest to production using free hosting services.

## 📋 Prerequisites

1. **GitHub Account** - To host your code
2. **Vercel Account** - For frontend deployment (free)
3. **Render Account** - For backend deployment (free)

## 🔧 Step-by-Step Deployment

### Step 1: Prepare Your Code

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/DocDigest.git
   git push -u origin main
   ```

### Step 2: Deploy Backend (FastAPI) to Render

1. **Go to [render.com](https://render.com)** and create an account
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service**:
   - **Name**: `docdigest-backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

5. **Click "Create Web Service"**
6. **Wait for deployment** (5-10 minutes)
7. **Copy your service URL** (e.g., `https://docdigest-backend.onrender.com`)

### Step 3: Deploy Frontend (Next.js) to Vercel

1. **Go to [vercel.com](https://vercel.com)** and create an account
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Environment Variables**:
     - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g., `https://docdigest-backend.onrender.com`)

5. **Click "Deploy"**
6. **Wait for deployment** (2-3 minutes)
7. **Your app is live!** 🎉

## 🔗 Alternative Deployment Options

### Frontend Alternatives:
- **Netlify**: Similar to Vercel, also free
- **GitHub Pages**: Free but requires additional setup

### Backend Alternatives:
- **Railway**: Free tier available, easy deployment
- **Heroku**: Paid but very reliable
- **DigitalOcean App Platform**: Paid but powerful

## 🌍 Environment Variables

### Frontend (Vercel):
```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

### Backend (Render):
```
PORT=10000
```

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Backend already has CORS configured for all origins
   - If issues persist, check your API URL

2. **Model Loading Issues**:
   - First request might be slow as the model downloads
   - Render free tier has cold starts

3. **File Upload Issues**:
   - Ensure file size is reasonable (< 10MB)
   - Check file format (PDF/DOCX only)

### Performance Tips:

1. **Enable Auto-Deploy**: Both Vercel and Render support automatic deployments
2. **Monitor Usage**: Free tiers have limits
3. **Scale Up**: Upgrade to paid plans for production use

## 📊 Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Render Logs**: Check deployment and runtime logs
- **Error Tracking**: Consider adding Sentry for error monitoring

## 🔒 Security Considerations

1. **API Rate Limiting**: Consider adding rate limiting for production
2. **File Validation**: Backend validates file types
3. **Environment Variables**: Never commit sensitive data
4. **HTTPS**: Both Vercel and Render provide SSL certificates

## 🎯 Next Steps

1. **Custom Domain**: Add your own domain name
2. **Analytics**: Add Google Analytics or similar
3. **Monitoring**: Set up uptime monitoring
4. **Backup**: Regular database backups if you add one

## 💰 Cost Breakdown

- **Vercel**: Free tier includes 100GB bandwidth/month
- **Render**: Free tier includes 750 hours/month
- **Total**: $0/month for basic usage

## 🆘 Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Render Docs**: [render.com/docs](https://render.com/docs)
- **FastAPI Docs**: [fastapi.tiangolo.com](https://fastapi.tiangolo.com)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Your DocDigest app is now live and ready to use!** 🎉 