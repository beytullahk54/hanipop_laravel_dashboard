<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->withoutTwoFactor()->create([
            'name' => 'Test User',
            'email' => 'byt.kahraman@gmail.com',
            "password" => Hash::make('password'),
        ]);
    }
}
