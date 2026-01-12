FROM php:8.4-apache

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV COMPOSER_MEMORY_LIMIT=-1

# Set Laravel environment defaults (to avoid Redis dependency)
ENV CACHE_DRIVER=file
ENV CACHE_STORE=file
ENV SESSION_DRIVER=file
ENV QUEUE_CONNECTION=sync
ENV LOG_CHANNEL=stderr

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libwebp-dev \
    libxpm-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zlib1g-dev \
    zip \
    unzip \
    git \
    curl \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Configure GD with all image format support
RUN docker-php-ext-configure gd \
    --with-freetype=/usr/include/ \
    --with-jpeg=/usr/include/ \
    --with-webp=/usr/include/ \
    --with-xpm=/usr/include/

# Install PHP extensions in separate layers for better caching
RUN docker-php-ext-install pdo_pgsql pdo_mysql
RUN docker-php-ext-install mbstring exif pcntl
RUN docker-php-ext-install bcmath zip
RUN docker-php-ext-install -j$(nproc) gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install dependencies (without scripts for now)
RUN composer install \
    --no-interaction \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --prefer-dist

# Copy application code
COPY . .

# Complete composer install with autoloader
RUN composer dump-autoload --optimize --classmap-authoritative

# Create necessary directories and set permissions
RUN mkdir -p storage/framework/{sessions,views,cache} \
    && mkdir -p storage/logs \
    && mkdir -p bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Configure PHP
RUN echo "memory_limit=512M" > /usr/local/etc/php/conf.d/memory-limit.ini \
    && echo "upload_max_filesize=20M" > /usr/local/etc/php/conf.d/upload-limit.ini \
    && echo "post_max_size=20M" >> /usr/local/etc/php/conf.d/upload-limit.ini

# Apache Configuration to point to public
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Enable Apache modules
RUN a2enmod rewrite headers

# Create startup script - clear cache first to pick up env vars
RUN echo '#!/bin/bash\n\
set -e\n\
echo "Clearing caches..."\n\
php artisan config:clear\n\
php artisan cache:clear\n\
php artisan route:clear\n\
php artisan view:clear\n\
echo "Rebuilding caches..."\n\
php artisan config:cache\n\
php artisan route:cache\n\
php artisan view:cache\n\
echo "Starting Apache..."\n\
apache2-foreground' > /usr/local/bin/start.sh \
    && chmod +x /usr/local/bin/start.sh

# Expose port
EXPOSE 80

# Start Apache
CMD ["/usr/local/bin/start.sh"]
