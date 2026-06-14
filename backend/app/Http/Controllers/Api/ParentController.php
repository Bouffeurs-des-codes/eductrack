<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Eleve;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ParentController extends Controller
{
    public function enfants(Request $request): JsonResponse
    {
        $email = $request->query('email');

        $query = Eleve::query()
            ->with(['presences', 'notes'])
            ->orderBy('nom');

        if ($email) {
            $query->where('parent_email', $email);
        }

        return response()->json([
            'data' => $query->get()->map(fn (Eleve $eleve): array => $this->rapportEleve($eleve)),
        ]);
    }

    public function rapport(Eleve $eleve): JsonResponse
    {
        $eleve->load(['presences', 'notes']);

        return response()->json([
            'data' => $this->rapportEleve($eleve),
        ]);
    }

    private function rapportEleve(Eleve $eleve): array
    {
        $totalPresences = $eleve->presences->count();
        $joursPresents = $eleve->presences->where('statut', 'P')->count();
        $moyenne = $eleve->notes->count() > 0
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
            'presences' => $eleve->presences->sortByDesc('date_presence')->values(),
            'notes' => $eleve->notes->sortByDesc('date_note')->values(),
            'total_presences' => $totalPresences,
            'jours_presents' => $joursPresents,
            'nombre_notes' => $eleve->notes->count(),
            'taux_presence' => $ratioPresence === null ? null : (int) round($ratioPresence * 100),
            'moyenne' => $moyenne,
            'statut_general' => $statutGeneral,
        ];
    }
}
