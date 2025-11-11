<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Menu extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'firma_id',
        'menu_url',
        'giris_yapan_katilimci_sayisi',
    ];

    public  function  firma() :BelongsTo
    {
        return $this->belongsTo(Firma::class,'firma_id');
    }


}
