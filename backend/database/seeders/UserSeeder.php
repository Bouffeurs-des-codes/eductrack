<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        User::query()->upsert([
            ['id' => 1, 'name' => 'Administrateur EduTrack', 'email' => 'admin@gmail.com', 'password' => bcrypt('password'), 'role' => 'admin', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'name' => 'Enseignant EduTrack', 'email' => 'enseignant@gmail.com', 'password' => bcrypt('password'), 'role' => 'enseignant', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 3, 'name' => 'Parent EduTrack', 'email' => 'skykayumbabokomo@gmail.com', 'password' => bcrypt('password'), 'role' => 'parent', 'created_at' => $now, 'updated_at' => $now],
        ], ['id'], ['name', 'email', 'password', 'role', 'updated_at']);
    }
}
