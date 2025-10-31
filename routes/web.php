<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Urun;
use App\Models\UrunKategori;
use App\Models\Firma;

Route::get('/', fn () => Inertia::render('Welcome'))->name('home');

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('dashboard', function () {
        $user = Auth::user();
        $firmaId = $user?->firma_id;

        $productCount = 0;
        $categoryCount = 0;

        if ($firmaId) {
            $firma = Firma::find($firmaId);
            if ($firma) {
                $productCount = $firma->uruns()->count();
                $categoryCount = $firma->urunKategoris()->count();
            }
        }

        return Inertia::render('Dashboard', [
            'productCount' => $productCount,
            'categoryCount' => $categoryCount,
        ]);
    })->name('dashboard');
    Route::get('menu', [App\Http\Controllers\MenuController::class, 'index'])->name('menu');
    Route::get('destek', [App\Http\Controllers\Destek\Customer\DestekController::class, 'index'])->name('destek');
    Route::get('musteri-geri-bildirimleri', [App\Http\Controllers\MusteriBildirimController::class, 'index'])->name('musteri-geri-bildirimleri');
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
    
    // Destek API routes
    Route::prefix('api/destek')->group(function () {
        Route::get('/', [App\Http\Controllers\Destek\Customer\DestekController::class, 'index']);
        Route::post('/', [App\Http\Controllers\Destek\Customer\DestekController::class, 'store']);
        Route::get('/{id}', [App\Http\Controllers\Destek\Customer\DestekController::class, 'show']);
        Route::put('/{id}', [App\Http\Controllers\Destek\Customer\DestekController::class, 'update']);
        Route::delete('/{id}', [App\Http\Controllers\Destek\Customer\DestekController::class, 'destroy']);
    });
    
    // Musteri Bildirimleri API routes
    Route::prefix('api/musteri-bildirimleri')->group(function () {
        Route::get('/', [App\Http\Controllers\MusteriBildirimController::class, 'index']);
        Route::get('/{id}', [App\Http\Controllers\MusteriBildirimController::class, 'show']);
    });
    
    // Eski sayfalar (gerekirse kaldırılabilir)
    Route::get('inbox', fn () => Inertia::render('Inbox'))->name('inbox');
    Route::get('customers', fn () => Inertia::render('Customers'))->name('customers');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
