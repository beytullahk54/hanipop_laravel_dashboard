<?php

namespace App\Http\Controllers;

use App\Models\Firma;
use App\Models\Urun;
use App\Models\UrunKategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class MenuController extends Controller
{
    /**
     * Display the menu management page.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        if (!$user->firma_id) {
            return redirect()->route('dashboard')->with('error', 'Firma bilgisi bulunamadı.');
        }

        $firma = Firma::find($user->firma_id);
        
        if (!$firma) {
            return redirect()->route('dashboard')->with('error', 'Firma bulunamadı.');
        }

        // Dil seçimi - session'dan veya request'ten al
        $currentLanguage = $request->get('lang', session('admin_language', 'tr'));
        session(['admin_language' => $currentLanguage]);

        // Kategorileri firma_id'ye göre getir
        $kategoriler = UrunKategori::where('firma_id', $user->firma_id)
            ->orderBy('kategori_sira')
            ->get()
            ->map(function ($kategori) {
                // JSON formatını düzelt
                if (is_string($kategori->kategori_adi)) {
                    $kategori->kategori_adi = json_decode($kategori->kategori_adi, true) ?: ['tr' => $kategori->kategori_adi];
                }
                return $kategori;
            });

        // İlk kategori seçiliyse, o kategorinin ürünlerini getir
        $selectedKategori = $kategoriler->first();
        $urunler = collect();

        if ($selectedKategori) {
            $urunler = Urun::where('firma_id', $user->firma_id)
                ->where('kategori_id', $selectedKategori->id)
                ->orderBy('urun_sira')
                ->get()
                ->map(function ($urun) {
                    // JSON formatını düzelt
                    if (is_string($urun->urun_adi)) {
                        $urun->urun_adi = json_decode($urun->urun_adi, true) ?: ['tr' => $urun->urun_adi];
                    }
                    if (is_string($urun->urun_aciklama)) {
                        $urun->urun_aciklama = json_decode($urun->urun_aciklama, true) ?: ['tr' => $urun->urun_aciklama];
                    }
                    return $urun;
                });
        }

        return Inertia::render('Menu', [
            'firma' => $firma,
            'kategoriler' => $kategoriler,
            'urunler' => $urunler,
            'selectedKategori' => $selectedKategori,
            'currentLanguage' => $currentLanguage,
            'availableLanguages' => [
                ['code' => 'tr', 'name' => 'Türkçe'],
                ['code' => 'en', 'name' => 'English']
            ],
        ]);
    }

    /**
     * Get products by category.
     */
    public function getProductsByCategory(Request $request)
    {
        $user = Auth::user();
        $kategoriId = $request->input('kategori_id');

        $urunler = Urun::where('firma_id', $user->firma_id)
            ->where('kategori_id', $kategoriId)
            ->orderBy('urun_sira')
            ->get()
            ->map(function ($urun) {
                // JSON formatını düzelt
                if (is_string($urun->urun_adi)) {
                    $urun->urun_adi = json_decode($urun->urun_adi, true) ?: ['tr' => $urun->urun_adi];
                }
                if (is_string($urun->urun_aciklama)) {
                    $urun->urun_aciklama = json_decode($urun->urun_aciklama, true) ?: ['tr' => $urun->urun_aciklama];
                }
                return $urun;
            });

        return response()->json([
            'urunler' => $urunler
        ]);
    }

    /**
     * Update product information.
     */
    public function updateProduct(Request $request, $id)
    {
        $user = Auth::user();
        $currentLanguage = session('admin_language', 'tr');
        
        $request->validate([
            'urun_adi' => 'required|string|max:255',
            'urun_aciklama' => 'required|string',
            'urun_fiyati' => 'nullable|string|max:25',
            'paket_urun_fiyati' => 'nullable|string|max:25',
        ]);

        $urun = Urun::where('id', $id)
            ->where('firma_id', $user->firma_id)
            ->firstOrFail();

        // Mevcut JSON verilerini al
        $currentAdi = json_decode($urun->urun_adi, true) ?? [];
        $currentAciklama = json_decode($urun->urun_aciklama, true) ?? [];

        // Seçili dildeki veriyi güncelle
        $currentAdi[$currentLanguage] = $request->urun_adi;
        $currentAciklama[$currentLanguage] = $request->urun_aciklama;

        $urun->update([
            'urun_adi' => json_encode($currentAdi),
            'urun_aciklama' => json_encode($currentAciklama),
            'urun_fiyati' => $request->urun_fiyati,
            'paket_urun_fiyati' => $request->paket_urun_fiyati,
        ]);

        return response()->json([
            'message' => 'Ürün başarıyla güncellendi.',
            'urun' => $urun
        ]);
    }

    /**
     * Get single product details.
     */
    public function getProduct($id)
    {
        $user = Auth::user();
        
        $urun = Urun::where('id', $id)
            ->where('firma_id', $user->firma_id)
            ->with('kategori')
            ->firstOrFail();

        return response()->json([
            'urun' => $urun
        ]);
    }

    /**
     * Create new product.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        $request->validate([
            'urun_adi' => 'required|string|max:255',
            'urun_aciklama' => 'required|string',
            'urun_fiyati' => 'nullable|string|max:25',
            'paket_urun_fiyati' => 'nullable|string|max:25',
            'kategori_id' => 'required|exists:urun_kategoris,id',
            'urun_sira' => 'nullable|integer',
        ]);

        $urun = Urun::create([
            'firma_id' => $user->firma_id,
            'kategori_id' => $request->kategori_id,
            'urun_adi' => $request->urun_adi,
            'urun_aciklama' => $request->urun_aciklama,
            'urun_fiyati' => $request->urun_fiyati,
            'paket_urun_fiyati' => $request->paket_urun_fiyati,
            'urun_sira' => $request->urun_sira ?? 0,
        ]);

        return response()->json([
            'message' => 'Ürün başarıyla oluşturuldu.',
            'urun' => $urun
        ]);
    }

    /**
     * Delete product.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        
        $urun = Urun::where('id', $id)
            ->where('firma_id', $user->firma_id)
            ->firstOrFail();

        $urun->delete();

        return response()->json([
            'message' => 'Ürün başarıyla silindi.'
        ]);
    }

    /**
     * Create new category.
     */
    public function storeCategory(Request $request)
    {
        $user = Auth::user();
        $currentLanguage = session('admin_language', 'tr');
        
        $request->validate([
            'kategori_adi' => 'required|string|max:255',
            'kategori_sira' => 'nullable|integer',
        ]);

        // Mevcut JSON verilerini al veya yeni oluştur
        $kategoriAdi = json_encode([$currentLanguage => $request->kategori_adi]);

        $kategori = UrunKategori::create([
            'firma_id' => $user->firma_id,
            'kategori_adi' => $kategoriAdi,
            'kategori_sira' => $request->kategori_sira ?? 0,
            'kategori_durum' => 'active',
        ]);

        return response()->json([
            'message' => 'Kategori başarıyla oluşturuldu.',
            'kategori' => $kategori
        ]);
    }

    /**
     * Update category.
     */
    public function updateCategory(Request $request, $id)
    {
        $user = Auth::user();
        $currentLanguage = session('admin_language', 'tr');
        
        $request->validate([
            'kategori_adi' => 'required|string|max:255',
        ]);

        $kategori = UrunKategori::where('id', $id)
            ->where('firma_id', $user->firma_id)
            ->firstOrFail();

        // Mevcut JSON verilerini al
        $currentAdi = is_array($kategori->kategori_adi) 
            ? $kategori->kategori_adi 
            : (json_decode($kategori->kategori_adi ?? '{}', true) ?? []);

        // Seçili dildeki veriyi güncelle
        $currentAdi[$currentLanguage] = $request->kategori_adi;

        $kategori->update([
            'kategori_adi' => json_encode($currentAdi),
        ]);

        return response()->json([
            'message' => 'Kategori başarıyla güncellendi.',
            'kategori' => $kategori
        ]);
    }

    /**
     * Delete category.
     */
    public function destroyCategory($id)
    {
        $user = Auth::user();
        
        $kategori = UrunKategori::where('id', $id)
            ->where('firma_id', $user->firma_id)
            ->firstOrFail();

        // Kategoriye ait ürünleri kontrol et
        $urunCount = Urun::where('kategori_id', $id)->count();
        if ($urunCount > 0) {
            return response()->json([
                'message' => 'Bu kategoriye ait ürünler bulunduğu için silinemez.',
                'error' => true
            ], 400);
        }

        $kategori->delete();

        return response()->json([
            'message' => 'Kategori başarıyla silindi.'
        ]);
    }

    /**
     * Update product order.
     */
    public function updateProductOrder(Request $request)
    {
        $user = Auth::user();
        
        Log::info('Product order update request:', [
            'user_id' => $user->id,
            'firma_id' => $user->firma_id,
            'request_data' => $request->all()
        ]);
        
        $request->validate([
            'products' => 'required|array',
            'products.*.id' => 'required|integer',
            'products.*.order' => 'required|integer',
        ]);

        foreach ($request->products as $productData) {
            Log::info('Updating product order:', [
                'product_id' => $productData['id'],
                'new_order' => $productData['order']
            ]);
            
            Urun::where('id', $productData['id'])
                ->where('firma_id', $user->firma_id)
                ->update(['urun_sira' => $productData['order']]);
        }

        Log::info('Product order update completed successfully');

        return response()->json([
            'message' => 'Ürün sıralaması başarıyla güncellendi.'
        ]);
    }

    /**
     * Update category order.
     */
    public function updateCategoryOrder(Request $request)
    {
        $user = Auth::user();
        
        $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|integer',
            'categories.*.order' => 'required|integer',
        ]);

        foreach ($request->categories as $categoryData) {
            UrunKategori::where('id', $categoryData['id'])
                ->where('firma_id', $user->firma_id)
                ->update(['kategori_sira' => $categoryData['order']]);
        }

        return response()->json([
            'message' => 'Kategori sıralaması başarıyla güncellendi.'
        ]);
    }
}
