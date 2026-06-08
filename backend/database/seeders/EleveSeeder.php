<?php

namespace Database\Seeders;

use App\Models\Eleve;
use Illuminate\Database\Seeder;

class EleveSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        Eleve::query()->upsert([
            ['id' => 1, 'nom' => 'Jean-Paul Kashala', 'classe' => '3eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'nom' => 'Marie-Therese Mutombo', 'classe' => '3eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 3, 'nom' => 'Isaac Newton', 'classe' => '3eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 4, 'nom' => 'Sarah Malongo', 'classe' => '3eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 5, 'nom' => 'Patrick Lumumba', 'classe' => '3eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 6, 'nom' => 'Grace Nsimba', 'classe' => '3eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 7, 'nom' => 'Francois Tshilombo', 'classe' => '3eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 8, 'nom' => 'Esther Kabongo', 'classe' => '3eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 9, 'nom' => 'Emmanuel Kunda', 'classe' => '4eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 10, 'nom' => 'Sophie Mbuyi', 'classe' => '4eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 11, 'nom' => 'Daniel Kabila', 'classe' => '4eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 12, 'nom' => 'Catherine Tshiala', 'classe' => '4eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 13, 'nom' => 'Michel Kabengele', 'classe' => '5eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 14, 'nom' => 'Jeanne Mputu', 'classe' => '5eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 15, 'nom' => 'Joseph Ilunga', 'classe' => '5eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 16, 'nom' => 'Marie Kabedi', 'classe' => '6eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 17, 'nom' => 'Robert Masamba', 'classe' => '6eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 18, 'nom' => 'Alice Kalonji', 'classe' => '6eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 19, 'nom' => 'Thomas Kanza', 'classe' => '6eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 20, 'nom' => 'Julie Nkulu', 'classe' => '3eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 21, 'nom' => 'Paul Mulumba', 'classe' => '4eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 22, 'nom' => 'Nicole Badibanga', 'classe' => '5eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 23, 'nom' => 'Victor Musafiri', 'classe' => '3eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 24, 'nom' => 'Laura Mpoyi', 'classe' => '6eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 25, 'nom' => 'Henri Mukendi', 'classe' => '4eme IG', 'parent_phone' => '+243895646979', 'parent_email' => 'skykayumbabokomo@gmail.com', 'created_at' => $now, 'updated_at' => $now],
        ], ['id'], ['nom', 'classe', 'parent_phone', 'parent_email', 'updated_at']);
    }
}
