<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Firma;
use App\Models\Menu;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

use function event;
use function to_route;

class RegisterWithMenuController extends Controller
{
    /**
     * Handle an incoming registration request with menu creation.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'restoran_adi' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', Rules\Password::defaults()],
        ]);

        // Kullanıcı oluştur
        $user = User::create([
            'name' => $request->first_name . ' ' . $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Firma oluştur
        $firma = Firma::create([
            'dil' => '[{"id":1,"dil_adi":"Türkçe","dil_kodu":"tr","dil_bayrak":null,"checked":true}]',
            'firma_adi' => $request->restoran_adi,
            'firma_yetkili' => $request->first_name . ' ' . $request->last_name,
            'mail' => $request->email,
            'firma_durum' => 'active',
            'hizmetBitisTarihi' => now()->addYear(),
        ]);

        // Kullanıcıyı firmaya bağla
        $user->firma_id = $firma->id;
        $user->save();

        // Menü oluştur - benzersiz URL oluştur
        $menuUrl = Str::slug($request->restoran_adi) . '-' . Str::random(8);
        
        // URL'in benzersiz olduğundan emin ol
        while (Menu::where('menu_url', $menuUrl)->exists()) {
            $menuUrl = Str::slug($request->restoran_adi) . '-' . Str::random(8);
        }

        Menu::create([
            'firma_id' => $firma->id,
            'menu_url' => $menuUrl,
            'giris_yapan_katilimci_sayisi' => 0,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return to_route('dashboard');
    }
}

