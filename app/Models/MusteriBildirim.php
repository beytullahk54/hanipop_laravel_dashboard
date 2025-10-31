<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MusteriBildirim extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'musteri_bildirims';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'bildirim_baslik',
        'bildirim_aciklama',
        'bildirim_telefon',
        'masa_no',
        'firma_id',
        'durum',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the firma that owns the bildirim.
     */
    public function firma()
    {
        return $this->belongsTo(Firma::class, 'firma_id');
    }
}
