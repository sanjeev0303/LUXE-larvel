<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Health Check Route for Render
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
        'service' => 'Laravel API'
    ]);
});

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Protected Routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/profile', [\App\Http\Controllers\ProfileController::class, 'update']);
    Route::apiResource('/addresses', \App\Http\Controllers\AddressController::class);

    // Cart & Wishlist
    Route::get('/cart', [App\Http\Controllers\CartController::class, 'index']);
    Route::post('/cart', [App\Http\Controllers\CartController::class, 'store']);
    Route::put('/cart/{id}', [App\Http\Controllers\CartController::class, 'update']);
    Route::delete('/cart/{id}', [App\Http\Controllers\CartController::class, 'destroy']);
    Route::post('/cart/sync', [App\Http\Controllers\CartController::class, 'sync']);

    Route::get('/wishlist', [App\Http\Controllers\WishlistController::class, 'index']);
    Route::post('/wishlist/toggle', [App\Http\Controllers\WishlistController::class, 'toggle']);
    // Route::delete('/wishlist/{id}', [App\Http\Controllers\WishlistController::class, 'destroy']);

    // Checkout
    Route::post('/checkout', [PaymentController::class, 'createPaymentIntent']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);

    // Admin Routes
    Route::middleware('is_admin')->group(function () {
        Route::post('/admin/products', [ProductController::class, 'store']);
        Route::put('/admin/products/{id}', [ProductController::class, 'update']);
        Route::delete('/admin/products/{id}', [ProductController::class, 'destroy']);

        Route::apiResource('/admin/collections', \App\Http\Controllers\CollectionController::class)->except(['index', 'show']);

        Route::get('/admin/orders', [OrderController::class, 'adminIndex']);
        Route::patch('/admin/orders/{id}/status', [OrderController::class, 'updateStatus']);
    });
});

// Public Collection Routes
Route::get('/collections', [\App\Http\Controllers\CollectionController::class, 'index']);
Route::get('/collections/{id}', [\App\Http\Controllers\CollectionController::class, 'show']);
