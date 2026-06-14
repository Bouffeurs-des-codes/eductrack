<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Classe;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ClasseController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Classe::query()->orderBy('nom')->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $classe = Classe::query()->create($this->validateClasse($request));

        return response()->json([
            'message' => 'Classe creee.',
            'data' => $classe,
        ], 201);
    }

    public function update(Request $request, Classe $class): JsonResponse
    {
        $class->update($this->validateClasse($request, $class));

        return response()->json([
            'message' => 'Classe modifiee.',
            'data' => $class,
        ]);
    }

    public function destroy(Classe $class): JsonResponse
    {
        $class->delete();

        return response()->json([
            'message' => 'Classe supprimee.',
        ]);
    }

    private function validateClasse(Request $request, ?Classe $classe = null): array
    {
        return $request->validate([
            'nom' => ['required', 'string', 'max:60', Rule::unique('classes', 'nom')->ignore($classe?->id)],
            'niveau' => ['nullable', 'string', 'max:60'],
            'description' => ['nullable', 'string'],
        ]);
    }
}
