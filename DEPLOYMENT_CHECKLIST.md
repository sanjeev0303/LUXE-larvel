# Quick Deployment Checklist ✅

## Before Deployment

- [x] Fixed Dockerfile with proper GD extension dependencies
- [x] Added .dockerignore for optimized builds
- [x] Created health check endpoint
- [x] Added render.yaml configuration
- [x] CORS configuration ready

## Deploy to Render

### 1. Push to GitHub
```bash
git add .
git commit -m "fix: Docker build optimization and Render deployment setup"
git push origin main
```

### 2. Create Render Account
- Go to https://render.com
- Sign up/Login with GitHub

### 3. Deploy Using Blueprint (Easiest Method)

**Method A: Using render.yaml (Automatic)**
1. In Render Dashboard, click "New" → "Blueprint"
2. Connect your GitHub repository: `sanjeev0303/LUXE-larvel`
3. Render will automatically detect `render.yaml`
4. Click "Apply" - it will create:
   - Backend web service (Laravel)
   - Frontend static site (React)
   - PostgreSQL database
5. Wait for deployment to complete (~10-15 minutes)

**Method B: Manual Setup**

#### Backend:
1. New → Web Service
2. Repository: Your GitHub repo
3. Settings:
   - Name: `laravel-backend`
   - Root Directory: `backend`
   - Environment: Docker
   - Branch: `main`
   - Plan: Free
4. Add environment variables (see below)
5. Create Service

#### Database:
1. New → PostgreSQL
2. Name: `laravel-db`
3. Database: `laravel_db`
4. User: `laravel_user`
5. Plan: Free
6. Copy connection details to backend env vars

#### Frontend:
1. New → Static Site
2. Repository: Your GitHub repo
3. Settings:
   - Name: `react-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. Add environment variable:
   - `VITE_API_URL`: Your backend URL
5. Rewrite Rules: `/* /index.html 200`

### 4. Environment Variables for Backend

**Required:**
```bash
# App
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:... # Generate with: php artisan key:generate --show
APP_URL=https://your-backend.onrender.com

# Database (from Render PostgreSQL)
DB_CONNECTION=pgsql
DB_HOST=<from-render-db>
DB_PORT=5432
DB_DATABASE=<from-render-db>
DB_USERNAME=<from-render-db>
DB_PASSWORD=<from-render-db>

# Cache & Session
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync

# Logging
LOG_CHANNEL=stderr
LOG_LEVEL=info

# CORS (frontend URL)
ALLOWED_ORIGINS=https://your-frontend.onrender.com,http://localhost:5173
```

**Optional (Add if using):**
```bash
CLOUDINARY_URL=cloudinary://...
STRIPE_SECRET=sk_live_...
MAIL_MAILER=smtp
# ... other services
```

### 5. Post-Deployment

#### Run Migrations:
1. Go to backend service in Render
2. Click "Shell" tab
3. Run:
```bash
php artisan migrate --force
php artisan db:seed # if you have seeders
```

#### Test Health Check:
```bash
curl https://your-backend.onrender.com/api/health
```

Expected:
```json
{"status":"ok","timestamp":"...","service":"Laravel API"}
```

### 6. Update Frontend Environment

In Render Frontend service settings, add:
```bash
VITE_API_URL=https://your-backend.onrender.com
```

### 7. Test Everything

1. Visit frontend URL
2. Test registration/login
3. Test product listing
4. Test cart/wishlist
5. Test checkout

## Common Issues & Solutions

### ❌ GD Extension Error
✅ **Fixed in new Dockerfile** - All required libraries now included

### ❌ Build Timeout
- Render free tier has build time limits
- Our optimized Dockerfile should complete in ~5-10 minutes
- If still fails, try deploying during off-peak hours

### ❌ Database Connection Error
- Double-check DB environment variables
- Ensure `DB_CONNECTION=pgsql` (not mysql)
- Verify database service is running

### ❌ 500 Server Error
Check logs in Render:
- Missing APP_KEY → Generate and add to env vars
- Migration errors → Run migrations in Shell
- Permission errors → Should be fixed by Dockerfile

### ❌ CORS Error
Add frontend URL to `ALLOWED_ORIGINS`:
```bash
ALLOWED_ORIGINS=https://your-frontend.onrender.com,http://localhost:5173
```

### ❌ App Not Loading (Blank Page)
Frontend issue:
- Check if build completed successfully
- Verify `VITE_API_URL` is set correctly
- Check browser console for errors
- Ensure rewrite rules are set: `/* /index.html 200`

## Performance Tips

### Free Tier Considerations:
- Services sleep after 15 min inactivity
- First request after sleep is slow (~30-60 seconds)
- Consider paid tier ($7/month) for always-on

### Optimization:
- Caches are automatically cleared/set on deployment
- Enable OPcache (already in Dockerfile)
- Use CDN for assets (Cloudinary, etc.)

## Deployment URL Structure

After successful deployment, you'll have:
- **Backend**: `https://laravel-backend.onrender.com`
- **Frontend**: `https://react-frontend.onrender.com`
- **Database**: Internal connection (not public)

Update these in:
1. Frontend `.env`: `VITE_API_URL`
2. Backend `.env`: `APP_URL`, `ALLOWED_ORIGINS`

## Monitoring

In Render Dashboard:
- **Logs**: Real-time application logs
- **Metrics**: CPU, Memory usage
- **Events**: Deployment history
- **Shell**: Direct terminal access

## Custom Domain (Optional)

1. In service settings → "Custom Domains"
2. Add your domain
3. Update DNS records as instructed
4. SSL certificate auto-generated

## Rollback

If something breaks:
1. Go to service → "Events"
2. Find previous successful deployment
3. Click "Rollback to this version"

---

## 🎉 That's It!

Your Laravel + React e-commerce app should now be live!

**Useful Links:**
- Render Dashboard: https://dashboard.render.com
- Your Repo: https://github.com/sanjeev0303/LUXE-larvel
- Render Docs: https://render.com/docs

Need help? Check logs first, then DEPLOYMENT.md for detailed troubleshooting.
