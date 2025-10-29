<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UrunKategori extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'urun_kategoris';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'firma_id',
        'kategori_adi',
        'kategori_sira',
        'kategori_renk',
        'kategori_baslik',
        'kategori_gorsel',
        'kategori_durum',
        'kategori_gorsel_goruns',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'kategori_adi' => 'array',
            'kategori_sira' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the firma that owns the kategori.
     */
    public function firma()
    {
        return $this->belongsTo(Firma::class);
    }

    /**
     * Get the uruns for the kategori.
     */
    public function uruns()
    {
        return $this->hasMany(Urun::class, 'kategori_id');
    }
}
