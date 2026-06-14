<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Eleve;
use Illuminate\Http\JsonResponse;

class RapportController extends Controller
{
    public function index(): JsonResponse
    {
        $eleves = Eleve::query()->with(['presences', 'notes'])->get();
        $analyses = $eleves->map(function (Eleve $eleve): array {
            $totalPresences = $eleve->presences->count();
            $joursPresents = $eleve->presences->where('statut', 'P')->count();
            $ratioPresence = $totalPresences > 0 ? $joursPresents / $totalPresences : null;
            $moyenne = $eleve->notes->count() ? round($eleve->notes->avg('valeur'), 1) : null;

            return [
                'taux_presence' => $ratioPresence === null ? null : round($ratioPresence * 100),
                'moyenne' => $moyenne,
                'en_difficulte' => $ratioPresence !== null && $moyenne !== null
                    ? $moyenne < 10 || $ratioPresence < 0.8
                    : false,
            ];
        });

        $presences = $analyses->pluck('taux_presence')->filter(fn ($value) => $value !== null);
        $moyennes = $analyses->pluck('moyenne')->filter(fn ($value) => $value !== null);

        return response()->json([
            'data' => [
                'total_eleves' => $eleves->count(),
                'presence_moyenne' => $presences->count() ? round($presences->avg(), 1) : null,
                'moyenne_generale' => $moyennes->count() ? round($moyennes->avg(), 1) : null,
                'eleves_en_difficulte' => $analyses->where('en_difficulte', true)->count(),
            ],
        ]);
    }
}
