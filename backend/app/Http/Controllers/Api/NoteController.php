<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Eleve;
use App\Models\Note;
use App\Services\ParentNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Note::query()
                ->with('eleve')
                ->latest('date_note')
                ->latest('id')
                ->get(),
        ]);
    }

    public function store(Request $request, ParentNotificationService $notifications): JsonResponse
    {
        $validated = $request->validate([
            'eleve_id' => ['required', 'integer', 'exists:eleves,id'],
            'type' => ['required', 'in:Interro,Examen'],
            'valeur' => ['required', 'numeric', 'min:0', 'max:20'],
            'date_note' => ['nullable', 'date'],
        ]);

        $note = Note::query()->create([
            'eleve_id' => $validated['eleve_id'],
            'type' => $validated['type'],
            'valeur' => $validated['valeur'],
            'date_note' => $validated['date_note'] ?? now()->toDateString(),
        ]);

        $eleve = Eleve::query()->findOrFail($validated['eleve_id']);
        $moyenne = round((float) $eleve->notes()->avg('valeur'), 1);
        $notification = null;

        if ($moyenne < 10) {
            $notification = $notifications->sendLowAverageEmail($eleve, $moyenne);
        }

        return response()->json([
            'message' => 'Note enregistree.',
            'data' => $note->load('eleve'),
            'moyenne' => $moyenne,
            'notification' => $notification,
        ], 201);
    }
}
