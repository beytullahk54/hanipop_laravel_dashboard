<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Firma extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'menu_type',
        'firma_adi',
        'hizmetBitisTarihi',
        'firma_telefon',
        'firma_yetkili',
        'firma_durum',
        'instagram',
        'facebook',
        'hakkimizda',
        'misyonumuz',
        'vizyonumuz',
        'adres',
        'sirket_telefon',
        'mail',
        'website_link',
        'arkaplan',
        'firma_arkaplan_renk',
        'max_masa',
        'firma_ikinci_isim',
        'kaydirilabilir_menu',
        'firma_logo',
        'firma_logo2',
        'firma_garson_cagir',
        'firma_bizden_kareler',
        'firma_subeler',
        'logo_gorunum',
        'firma_musteri_geri_bild',
        'firma_referanslar',
        'firma_bizimle_calismak',
        'firma_kategori_renk',
        'firma_baslik_renk',
        'satin_alinan_paket',
        'bulunduguKonumBaslar',
        'bulunduguKonumBitis',
        'twitter',
        'firma_telefon_nos',
        'dil',
        'firma_para_birimi',
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
     * Get the users for the firma.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the urun kategoris for the firma.
     */
    public function urunKategoris()
    {
        return $this->hasMany(UrunKategori::class);
    }

    /**
     * Get the uruns for the firma.
     */
    public function uruns()
    {
        return $this->hasMany(Urun::class);
    }
}
