<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Eleve;
use Illuminate\Http\JsonResponse;

class AnalyseController extends Controller
{
    public function index(): JsonResponse
    {
        $analyses = Eleve::query()
            ->with(['presences', 'notes'])
            ->orderBy('id')
            ->get()
            ->map(function (Eleve $eleve): array {
                $totalPresences = $eleve->presences->count();
                $joursPresents = $eleve->presences->where('statut', 'P')->count();
                $nombreNotes = $eleve->notes->count();
                $moyenne = $nombreNotes > 0
                    ? round($eleve->notes->avg('valeur'), 1)
                    : null;

                $ratioPresence = $totalPresences > 0 ? $joursPresents / $totalPresences : null;
                $statutGeneral = 'Donnees insuffisantes';

                if ($ratioPresence !== null && $moyenne !== null) {
                    $statutGeneral = $moyenne >= 10 && $ratioPresence >= 0.8
                        ? 'Regulier et performant'
                        : 'En difficulte';
                }

                return [
                    'eleve' => $eleve->only(['id', 'nom', 'classe', 'parent_phone', 'parent_email']),
                    'total_presences' => $totalPresences,
                    'jours_presents' => $joursPresents,
                    'nombre_notes' => $nombreNotes,
                    'taux_presence' => $ratioPresence === null
                        ? null
                        : (int) round($ratioPresence * 100),
                    'moyenne' => $moyenne,
                    'statut_general' => $statutGeneral,
                ];
            });

        return response()->json([
            'data' => $analyses,
        ]);
    }
}
