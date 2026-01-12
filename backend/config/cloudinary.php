<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cloudinary Configuration Section
    |--------------------------------------------------------------------------
    |
    | Here you may specify the Cloudinary configuration to be used.
    |
    */

    'cloud_url' => env('CLOUDINARY_URL'),
    'notification_url' => env('CLOUDINARY_NOTIFICATION_URL'),
    'cloud' => [
        'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
        'api_key'    => env('CLOUDINARY_API_KEY'),
        'api_secret' => env('CLOUDINARY_API_SECRET'),
        'url'        => [
            'secure' => true,
        ],
    ],

];
