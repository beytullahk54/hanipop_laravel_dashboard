<?php

namespace App\Http\Controllers\Destek\Customer;

use App\Http\Controllers\Controller;
use App\Models\Destek;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DestekController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $destekler = Destek::query()
            ->when($user->firma_id, function ($query) use ($user) {
                $query->whereHas('user', function ($q) use ($user) {
                    $q->where('firma_id', $user->firma_id);
                });
            })
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        // API request ise JSON döndür
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'destekler' => $destekler
            ]);
        }

        return Inertia::render('Destek', [
            'destekler' => $destekler,
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
            'talep_baslik' => 'required|string|max:255',
            'talep_icerik' => 'required|string',
        ]);

        $destek = Destek::create([
            'talep_baslik' => $request->talep_baslik,
            'talep_icerik' => $request->talep_icerik,
            'user_id' => Auth::id(),
            'status' => $request->status ?? 'beklemede',
        ]);

        return response()->json([
            'message' => 'Destek talebi başarıyla oluşturuldu.',
            'destek' => $destek->load('user')
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = Auth::user();
        
        $destek = Destek::with('user')
            ->when($user->firma_id, function ($query) use ($user) {
                $query->whereHas('user', function ($q) use ($user) {
                    $q->where('firma_id', $user->firma_id);
                });
            })
            ->findOrFail($id);

        return response()->json([
            'destek' => $destek
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
            'talep_baslik' => 'sometimes|required|string|max:255',
            'talep_icerik' => 'sometimes|required|string',
            'status' => 'sometimes|required|string|in:beklemede,inceleniyor,cozuldu,kapandi',
        ]);

        $destek = Destek::query()
            ->when($user->firma_id, function ($query) use ($user) {
                $query->whereHas('user', function ($q) use ($user) {
                    $q->where('firma_id', $user->firma_id);
                });
            })
            ->findOrFail($id);

        $destek->update($request->only([
            'talep_baslik',
            'talep_icerik',
            'status',
        ]));

        return response()->json([
            'message' => 'Destek talebi başarıyla güncellendi.',
            'destek' => $destek->load('user')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        
        $destek = Destek::query()
            ->when($user->firma_id, function ($query) use ($user) {
                $query->whereHas('user', function ($q) use ($user) {
                    $q->where('firma_id', $user->firma_id);
                });
            })
            ->findOrFail($id);

        $destek->delete();

        return response()->json([
            'message' => 'Destek talebi başarıyla silindi.'
        ]);
    }
}

