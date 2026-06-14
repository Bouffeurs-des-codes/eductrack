<?php

namespace Database\Seeders;

use App\Models\Classe;
use App\Models\Eleve;
use Illuminate\Database\Seeder;

class ClasseSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();
        $classes = Eleve::query()
            ->select('classe')
            ->distinct()
            ->orderBy('classe')
            ->pluck('classe')
            ->filter()
            ->values()
            ->map(fn (string $classe): array => [
                'nom' => $classe,
                'niveau' => $classe,
                'description' => "Classe {$classe}",
                'created_at' => $now,
                'updated_at' => $now,
            ])
            ->all();

        if ($classes) {
            Classe::query()->upsert($classes, ['nom'], ['niveau', 'description', 'updated_at']);
        }
    }
}
