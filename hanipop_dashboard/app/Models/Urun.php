<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Urun extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'uruns';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'urun_adi',
        'urun_fiyati',
        'paket_urun_fiyati',
        'urun_sira',
        'urun_aciklama',
        'urun_gorsel',
        'urun_vitrin',
        'firma_id',
        'kategori_id',
        'sefin_tavsiyesi',
        'yeni_urun',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'urun_sira' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Get the firma that owns the urun.
     */
    public function firma()
    {
        return $this->belongsTo(Firma::class);
    }

    /**
     * Get the kategori that owns the urun.
     */
    public function kategori()
    {
        return $this->belongsTo(UrunKategori::class, 'kategori_id');
    }

    /**
     * Scope a query to only include active products.
     */
    public function scopeActive($query)
    {
        return $query->where('urun_durum', 'active');
    }

    /**
     * Scope a query to only include featured products.
     */
    public function scopeFeatured($query)
    {
        return $query->where('urun_vitrin', '1');
    }

    /**
     * Scope a query to only include chef's recommendations.
     */
    public function scopeChefRecommendation($query)
    {
        return $query->where('sefin_tavsiyesi', '1');
    }

    /**
     * Scope a query to only include new products.
     */
    public function scopeNewProducts($query)
    {
        return $query->where('yeni_urun', '1');
    }
}
