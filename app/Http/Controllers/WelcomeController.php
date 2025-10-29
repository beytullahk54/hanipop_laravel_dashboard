<?php

namespace App\Http\Controllers;

use App\Models\Urun;
use App\Models\UrunKategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    /**
     * Show the welcome page with user statistics
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $stats = [
            'urun_sayisi' => 0,
            'kategori_sayisi' => 0,
            'firma_adi' => null,
        ];

        if ($user && $user->firma_id) {
            $stats['urun_sayisi'] = Urun::where('firma_id', $user->firma_id)->count();
            $stats['kategori_sayisi'] = UrunKategori::where('firma_id', $user->firma_id)->count();
            $stats['firma_adi'] = $user->firma->firma_adi ?? null;
        }

        return Inertia::render('Welcome', [
            'stats' => $stats,
        ]);
    }
}
