<?php

// Stubs to silence linter errors in environments without vendor dependencies installed
if (! function_exists('env')) {
    function env($key, $default = null) {
        return $default;
    }
}

if (! function_exists('storage_path')) {
    function storage_path($path = '') {
        return $path;
    }
}

if (! function_exists('public_path')) {
    function public_path($path = '') {
        return $path;
    }
}

return [

    'default' => env('FILESYSTEM_DISK', 'local'),

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app'),
            'throw' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL').'/storage',
            'visibility' => 'public',
            'throw' => false,
        ],

        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'throw' => false,
        ],

        'cloudinary' => [
            'driver' => 'cloudinary',
            'cloud' => env('CLOUDINARY_CLOUD_NAME'),
            'key' => env('CLOUDINARY_API_KEY'),
            'secret' => env('CLOUDINARY_API_SECRET'),
            'secure' => true,
            'notification_url' => env('CLOUDINARY_NOTIFICATION_URL'),
        ],

    ],

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];
