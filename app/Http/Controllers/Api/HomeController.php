<?php
namespace App\Http\Controllers\Api;

use App\Models\Menu;
use App\Models\Firma;
use App\Models\Statistic;
use App\Models\Urun;
use App\Models\UrunKategori;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class HomeController extends Controller

{


    public function index()
    {
       return urun::with('kategori')->get();
    }
    public function kategoriGetir(Request $request)
    {

        $firma = Menu::where('menu_url','=',$request->kategori)->first();
        $firma->giris_yapan_katilimci_sayisi = $firma->giris_yapan_katilimci_sayisi+1;
        $firma->save();



        $statisticData = Statistic::where("tarih","=",Carbon::now()->format("Y-m-d"))->where("firma_id","=",$firma->firma_id)->first();
        if($statisticData)
        {
            $statisticData->goruntulenme_sayisi = $statisticData->goruntulenme_sayisi + 1;
            $statisticData->save();

        }else{
            $statisticSave = new Statistic();
            $statisticSave->menu_url = $request->kategori;
            $statisticSave->firma_id = $firma->firma_id;
            $statisticSave->tarih = Carbon::now()->format("Y-m-d");
            $statisticSave->goruntulenme_sayisi = 1;
            $statisticSave->save();
        }


        $firmaBilgiler = firma::where('id','=',$firma->firma_id)->first();
        if($firma){
            $firma_id = $firma->firma_id;
        }else{
            return ['status'=>"error",'message'=>"Firma bulunmuyor"];
        }
        return ['kategori'=>UrunKategori::where('firma_id','=',$firma_id)->orderBy('kategori_sira',"ASC")->get(),'firma'=>$firmaBilgiler];

    }
    public function urunGetir(Request $request)
    {
        $firma_id = menu::where('menu_url','=',$request->restoran)->first()->firma_id;
        $firma = Firma::where('id','=',$firma_id)->with('sube','bizdenKareler')->first();
        $kategoriler = UrunKategori::where('firma_id','=',$firma_id)->orderBy('kategori_sira',"ASC")->with('uruns')->get();
        $hasKategoriler = UrunKategori::where('firma_id','=',$firma_id)->where("id", "=", $request->kategori_id)->first();
        //$urunler = Urun::where('kategori_id','=',$request->kategori_id)->where('firma_id','=',$firma_id)->get();
        $urunler = Urun::where('firma_id','=',$firma_id)->get();
        $hasUrunler = Urun::where('firma_id','=',$firma_id)->where("kategori_id", "=", $request->kategori_id)->get();
    

        return ['urunler'=>$urunler,'kategoriler'=>$kategoriler,'firma'=>$firma, 'hasUrunler'=>$hasUrunler, 'hasKategoriler'=>$hasKategoriler];

    }
}
