<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [App\Http\Controllers\WelcomeController::class, 'index'])->name('home');

// Stats API route (auth middleware ile)
Route::middleware(['auth'])->group(function (): void {
    Route::get('api/stats/user', [App\Http\Controllers\StatsController::class, 'getUserStats'])->name('api.stats.user');
});

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');
    Route::get('menu', [App\Http\Controllers\MenuController::class, 'index'])->name('menu');
    Route::get('destek', fn () => Inertia::render('Destek'))->name('destek');
    Route::get('musteri-geri-bildirimleri', fn () => Inertia::render('MusteriGeriBildirimleri'))->name('musteri-geri-bildirimleri');
    Route::get('is-basvurulari', fn () => Inertia::render('IsBasvurulari'))->name('is-basvurulari');
    Route::get('bizden-kareler', fn () => Inertia::render('BizdenKareler'))->name('bizden-kareler');
    Route::get('subeler', fn () => Inertia::render('Subeler'))->name('subeler');
    Route::get('referanslar', fn () => Inertia::render('Referanslar'))->name('referanslar');
    Route::get('reklam-banner-yonetimi', fn () => Inertia::render('ReklamBannerYonetimi'))->name('reklam-banner-yonetimi');
    
    // Menu API routes
    Route::prefix('api/menu')->group(function () {
        Route::get('products-by-category', [App\Http\Controllers\MenuController::class, 'getProductsByCategory']);
        Route::get('product/{id}', [App\Http\Controllers\MenuController::class, 'getProduct']);
        Route::post('product', [App\Http\Controllers\MenuController::class, 'store']);
        Route::put('product/{id}', [App\Http\Controllers\MenuController::class, 'updateProduct']);
        Route::delete('product/{id}', [App\Http\Controllers\MenuController::class, 'destroy']);
        
        // Category routes
        Route::post('category', [App\Http\Controllers\MenuController::class, 'storeCategory']);
        Route::put('category/{id}', [App\Http\Controllers\MenuController::class, 'updateCategory']);
        Route::delete('category/{id}', [App\Http\Controllers\MenuController::class, 'destroyCategory']);
        
        // Order routes
        Route::put('products/order', [App\Http\Controllers\MenuController::class, 'updateProductOrder']);
        Route::put('categories/order', [App\Http\Controllers\MenuController::class, 'updateCategoryOrder']);
    });
    
    // Eski sayfalar (gerekirse kaldırılabilir)
    Route::get('inbox', fn () => Inertia::render('Inbox'))->name('inbox');
    Route::get('customers', fn () => Inertia::render('Customers'))->name('customers');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
