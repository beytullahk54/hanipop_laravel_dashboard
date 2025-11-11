<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Package::create(['title' => 'package_1', 'product_limit' => 50, 'view_limit' => 500, 'description' => 'Ücretsiz Paket, 50 ürün, 500 görüntülenme', 'price' => 0]);
        Package::create(['title' => 'package_2', 'product_limit' => null, 'view_limit' => 30000, 'description' => 'Aylık Paket', 'price' => 100]);
        Package::create(['title' => 'package_3', 'product_limit' => null, 'view_limit' => 30000, 'description' => 'Yıllık Paket', 'price' => 900]);
    }
}
