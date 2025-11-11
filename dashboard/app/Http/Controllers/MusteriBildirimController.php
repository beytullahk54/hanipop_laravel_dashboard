<?php

namespace App\Http\Controllers;

use App\Models\MusteriBildirim;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MusteriBildirimController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $bildirimler = MusteriBildirim::query()
            ->when($user->firma_id, function ($query) use ($user) {
                $query->where('firma_id', $user->firma_id);
            })
            ->with('firma')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        // API request ise JSON döndür
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'bildirimler' => $bildirimler
            ]);
        }

        return Inertia::render('MusteriBildirimleri', [
            'bildirimler' => $bildirimler,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'bildirim_baslik' => 'required|string|max:255',
            'bildirim_aciklama' => 'required|string',
            'bildirim_telefon' => 'nullable|string|max:255',
            'masa_no' => 'nullable|string|max:255',
            'firma_id' => 'nullable|string|max:255',
            'durum' => 'nullable|string|max:255',
        ]);

        $bildirim = MusteriBildirim::create([
            'bildirim_baslik' => $request->bildirim_baslik,
            'bildirim_aciklama' => $request->bildirim_aciklama,
            'bildirim_telefon' => $request->bildirim_telefon,
            'masa_no' => $request->masa_no,
            'firma_id' => $request->firma_id ?? Auth::user()->firma_id,
            'durum' => $request->durum ?? 'beklemede',
        ]);

        return response()->json([
            'message' => 'Müşteri bildirimi başarıyla oluşturuldu.',
            'bildirim' => $bildirim->load('firma')
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = Auth::user();
        
        $bildirim = MusteriBildirim::with('firma')
            ->when($user->firma_id, function ($query) use ($user) {
                $query->where('firma_id', $user->firma_id);
            })
            ->findOrFail($id);

        return response()->json([
            'bildirim' => $bildirim
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        
        $request->validate([
            'bildirim_baslik' => 'sometimes|required|string|max:255',
            'bildirim_aciklama' => 'sometimes|required|string',
            'bildirim_telefon' => 'nullable|string|max:255',
            'masa_no' => 'nullable|string|max:255',
            'firma_id' => 'nullable|string|max:255',
            'durum' => 'sometimes|required|string|max:255',
        ]);

        $bildirim = MusteriBildirim::query()
            ->when($user->firma_id, function ($query) use ($user) {
                $query->where('firma_id', $user->firma_id);
            })
            ->findOrFail($id);

        $bildirim->update($request->only([
            'bildirim_baslik',
            'bildirim_aciklama',
            'bildirim_telefon',
            'masa_no',
            'firma_id',
            'durum',
        ]));

        return response()->json([
            'message' => 'Müşteri bildirimi başarıyla güncellendi.',
            'bildirim' => $bildirim->load('firma')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        
        $bildirim = MusteriBildirim::query()
            ->when($user->firma_id, function ($query) use ($user) {
                $query->where('firma_id', $user->firma_id);
            })
            ->findOrFail($id);

        $bildirim->delete();

        return response()->json([
            'message' => 'Müşteri bildirimi başarıyla silindi.'
        ]);
    }
}
