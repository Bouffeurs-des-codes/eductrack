<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Eleve;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EleveController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Eleve::query()
                ->orderBy('id')
                ->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $eleve = Eleve::query()->create($this->validateEleve($request));

        return response()->json([
            'message' => 'Eleve cree.',
            'data' => $eleve,
        ], 201);
    }

    public function update(Request $request, Eleve $eleve): JsonResponse
    {
        $eleve->update($this->validateEleve($request));

        return response()->json([
            'message' => 'Eleve modifie.',
            'data' => $eleve,
        ]);
    }

    public function destroy(Eleve $eleve): JsonResponse
    {
        $eleve->delete();

        return response()->json([
            'message' => 'Eleve supprime.',
        ]);
    }

    private function validateEleve(Request $request): array
    {
        return $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'classe' => ['required', 'string', 'max:60'],
            'parent_phone' => ['required', 'string', 'max:30'],
            'parent_email' => ['required', 'email', 'max:150'],
        ]);
    }
}
