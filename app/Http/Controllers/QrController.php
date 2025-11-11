<?php

namespace App\Http\Controllers;

use App\Models\Firma;
use App\Models\Menu;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class QrController extends Controller
{
    /**
     * Generate QR code for the authenticated user's firm.
     */
    public function generate(Request $request)
    {
        $user = Auth::user();

        if (!$user->firma_id) {
            return response()->json([
                'error' => 'Firma bilgisi bulunamadı.',
            ], 404);
        }

        $firma = Firma::with('menu')->find($user->firma_id);

        if (!$firma) {
            return response()->json([
                'error' => 'Firma bulunamadı.',
            ], 404);
        }

        // Menu tablosundan menu_url'i al
        $menu = Menu::where('firma_id', $firma->id)->first();
        
        if (!$menu || !$menu->menu_url) {
            return response()->json([
                'error' => 'Menü URL bulunamadı. Lütfen önce menü oluşturun.',
            ], 404);
        }

        // .env'den base URL'i al
        $menuBaseUrl = env('MENU_BASE_URL');
        
        if (!$menuBaseUrl) {
            return response()->json([
                'error' => 'MENU_BASE_URL .env dosyasında tanımlanmamış.',
            ], 500);
        }
        
        // URL'i temizle (sonunda / varsa kaldır)
        $menuBaseUrl = rtrim($menuBaseUrl, '/');
        
        // Public menü URL'i oluştur (?url= parametresi ile)
        $publicMenuUrl = $menuBaseUrl . '?url=' . $menu->menu_url;

        // QR kod üret
        $renderer = new ImageRenderer(
            new RendererStyle(400),
            new SvgImageBackEnd()
        );

        $writer = new Writer($renderer);
        $qrCodeSvg = $writer->writeString($publicMenuUrl);

        return response()->json([
            'qr_code_svg' => $qrCodeSvg,
            'url' => $publicMenuUrl,
            'firma_adi' => $firma->firma_adi,
        ]);
    }

    /**
     * Download QR code as SVG.
     * Frontend will convert SVG to PNG if needed.
     */
    public function download(Request $request)
    {
        $user = Auth::user();

        if (!$user->firma_id) {
            return response()->json([
                'error' => 'Firma bilgisi bulunamadı.',
            ], 404);
        }

        $firma = Firma::with('menu')->find($user->firma_id);

        if (!$firma) {
            return response()->json([
                'error' => 'Firma bulunamadı.',
            ], 404);
        }

        // Menu tablosundan menu_url'i al
        $menu = Menu::where('firma_id', $firma->id)->first();
        
        if (!$menu || !$menu->menu_url) {
            return response()->json([
                'error' => 'Menü URL bulunamadı. Lütfen önce menü oluşturun.',
            ], 404);
        }

        // .env'den base URL'i al
        $menuBaseUrl = env('MENU_BASE_URL');
        
        if (!$menuBaseUrl) {
            return response()->json([
                'error' => 'MENU_BASE_URL .env dosyasında tanımlanmamış.',
            ], 500);
        }
        
        // URL'i temizle (sonunda / varsa kaldır)
        $menuBaseUrl = rtrim($menuBaseUrl, '/');
        
        // Public menü URL'i oluştur (?url= parametresi ile)
        $publicMenuUrl = $menuBaseUrl . '?url=' . $menu->menu_url;

        // QR kod üret (SVG olarak)
        $renderer = new ImageRenderer(
            new RendererStyle(400),
            new SvgImageBackEnd()
        );

        $writer = new Writer($renderer);
        $qrCodeSvg = $writer->writeString($publicMenuUrl);

        $filename = 'qr-code-'.Str::slug($firma->firma_adi ?? 'menu').'.svg';

        return response($qrCodeSvg)
            ->header('Content-Type', 'image/svg+xml')
            ->header('Content-Disposition', 'attachment; filename="'.$filename.'"');
    }
}

