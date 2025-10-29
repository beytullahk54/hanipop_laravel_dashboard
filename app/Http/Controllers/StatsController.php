<?php

namespace App\Http\Controllers;

use App\Models\Urun;
use App\Models\UrunKategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StatsController extends Controller
{
    /**
     * Get user's product and category statistics
     */
    public function getUserStats(Request $request)
    {
        $user = Auth::user();
        
        if (!$user || !$user->firma_id) {
            return response()->json([
                'urun_sayisi' => 0,
                'kategori_sayisi' => 0,
                'firma_adi' => null
            ]);
        }

        $urunSayisi = Urun::where('firma_id', $user->firma_id)->count();
        $kategoriSayisi = UrunKategori::where('firma_id', $user->firma_id)->count();
        $firmaAdi = $user->firma->firma_adi ?? 'Bilinmeyen Firma';

        return response()->json([
            'urun_sayisi' => $urunSayisi,
            'kategori_sayisi' => $kategoriSayisi,
            'firma_adi' => $firmaAdi
        ]);
    }
}
