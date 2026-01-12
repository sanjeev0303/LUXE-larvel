# Render Deployment Guide for Laravel E-commerce

## Issues Fixed

### 1. GD Extension Compilation Error
**Problem:** The GD extension was failing during compilation due to missing image format libraries.

**Solution:**
- Added all required image format libraries: `libjpeg62-turbo-dev`, `libfreetype6-dev`, `libwebp-dev`, `libxpm-dev`, `zlib1g-dev`
- Properly configured GD with explicit paths to all image format libraries
- Split extension installation into separate RUN commands for better caching and debugging

### 2. Dockerfile Optimization
**Changes Made:**
- Added proper environment variables for Composer and build process
- Implemented multi-stage dependency installation for better caching
- Added memory limit configurations for PHP
- Created startup script for Laravel cache optimization
- Improved Apache configuration for Laravel
- Added necessary PHP extensions: `pdo_mysql`, `zip`

### 3. Docker Build Optimization
**Created `.dockerignore`** to:
- Reduce build context size
- Exclude unnecessary files (tests, documentation, IDE configs)
- Speed up builds significantly

## Deployment Steps

### Option 1: Using render.yaml (Recommended)

1. **Commit all changes:**
   ```bash
   git add .
   git commit -m "Fix: Optimize Dockerfile and add Render configuration"
   git push origin main
   ```

2. **Deploy on Render:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml` and create all services

3. **Set Environment Variables:**
   The render.yaml includes most variables, but you need to add:
   - `CLOUDINARY_URL` (if using Cloudinary)
   - `STRIPE_SECRET` (if using Stripe)
   - Any other API keys

### Option 2: Manual Deployment

#### Backend (Laravel)

1. **Create Web Service:**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Set Root Directory: `backend`
   - Environment: Docker
   - Plan: Free

2. **Environment Variables:**
   ```
   APP_ENV=production
   APP_DEBUG=false
   APP_KEY=[Generate via: php artisan key:generate --show]
   APP_URL=https://your-app.onrender.com

   DB_CONNECTION=pgsql
   DB_HOST=[From Render Database]
   DB_PORT=5432
   DB_DATABASE=[From Render Database]
   DB_USERNAME=[From Render Database]
   DB_PASSWORD=[From Render Database]

   CACHE_DRIVER=file
   SESSION_DRIVER=file
   QUEUE_CONNECTION=sync

   LOG_CHANNEL=stderr
   LOG_LEVEL=info
   ```

3. **Create PostgreSQL Database:**
   - Click "New" → "PostgreSQL"
   - Copy connection details to backend environment variables

#### Frontend (React)

1. **Create Static Site:**
   - Click "New" → "Static Site"
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

2. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

3. **Rewrite Rules:**
   Add this to handle client-side routing:
   ```
   /* /index.html 200
   ```

## Post-Deployment

### 1. Run Migrations
Connect to your backend shell in Render and run:
```bash
php artisan migrate --force
```

### 2. Generate APP_KEY (if not set)
```bash
php artisan key:generate --show
```
Add the generated key to environment variables.

### 3. Clear Caches
```bash
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
```

### 4. Test the API
Check health endpoint:
```bash
curl https://your-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-13T...",
  "service": "Laravel API"
}
```

## Troubleshooting

### Build Fails with Memory Error
- Upgrade to a paid plan (more RAM)
- Or optimize composer install by removing dev dependencies

### Database Connection Issues
- Verify database environment variables match exactly
- Check if database service is running
- Ensure `DB_CONNECTION=pgsql` (not `mysql`)

### 500 Server Error
- Check logs in Render dashboard
- Ensure APP_KEY is set
- Verify file permissions (should be automatic with Docker)
- Check database migrations ran successfully

### CORS Issues
- Update `config/cors.php` to include frontend URL
- Or set `CORS_ALLOWED_ORIGINS` environment variable

## Important Notes

1. **Free Tier Limitations:**
   - Services spin down after 15 minutes of inactivity
   - First request after spin-down will be slow
   - Database has 90-day data retention

2. **Performance Tips:**
   - Use caching (config, route, view caches are automatic in startup script)
   - Enable OPcache for PHP
   - Consider upgrading to paid plan for better performance

3. **Security:**
   - Never commit `.env` file
   - Use Render's environment variables
   - Set `APP_DEBUG=false` in production
   - Keep all secrets in Render's secret management

## File Changes Summary

1. **backend/Dockerfile** - Fixed GD compilation and optimized build
2. **backend/.dockerignore** - Excluded unnecessary files
3. **backend/routes/api.php** - Added health check endpoint
4. **render.yaml** - Complete deployment configuration

## Next Steps

1. Commit and push all changes
2. Deploy on Render
3. Run database migrations
4. Test all API endpoints
5. Update frontend to point to production API
6. Deploy frontend

---

For more help, check:
- [Render Docs](https://render.com/docs)
- [Laravel Deployment Docs](https://laravel.com/docs/deployment)
