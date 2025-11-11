<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HomeController;

// API routes
// Bu dosyadaki route'lar otomatik olarak /api prefix'i ile çalışır

Route::middleware(['auth:sanctum'])->group(function (): void {
    // API route'larınızı buraya ekleyebilirsiniz
});

Route::post('/kategoriGetir', [HomeController::class,'kategoriGetir']);
Route::post('/urunGetir', [HomeController::class,'urunGetir']);
Route::post('/urunGetir', [HomeController::class,'urunGetir']);
