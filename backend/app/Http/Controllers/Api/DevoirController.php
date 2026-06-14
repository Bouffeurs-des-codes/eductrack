<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Devoir;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DevoirController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Devoir::query()
                ->orderByRaw('date_limite IS NULL')
                ->orderBy('date_limite')
                ->latest('id')
                ->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $devoir = Devoir::query()->create($this->validateDevoir($request));

        return response()->json([
            'message' => 'Devoir enregistre.',
            'data' => $devoir,
        ], 201);
    }

    public function update(Request $request, Devoir $devoir): JsonResponse
    {
        $devoir->update($this->validateDevoir($request));

        return response()->json([
            'message' => 'Devoir modifie.',
            'data' => $devoir,
        ]);
    }

    public function destroy(Devoir $devoir): JsonResponse
    {
        $devoir->delete();

        return response()->json([
            'message' => 'Devoir supprime.',
        ]);
    }

    private function validateDevoir(Request $request): array
    {
        return $request->validate([
            'titre' => ['required', 'string', 'max:255'],
            'classe' => ['required', 'string', 'max:60'],
            'matiere' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string'],
            'date_limite' => ['nullable', 'date'],
        ]);
    }
}
