<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Presence;
use App\Services\ParentNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PresenceController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Presence::query()
                ->with('eleve')
                ->latest('date_presence')
                ->latest('id')
                ->get(),
        ]);
    }

    public function store(Request $request, ParentNotificationService $notifications): JsonResponse
    {
        $validated = $request->validate([
            'eleve_id' => ['required', 'integer', 'exists:eleves,id'],
            'statut' => ['required', 'in:P,A,R'],
            'date_presence' => ['nullable', 'date'],
        ]);

        $presence = Presence::query()->updateOrCreate(
            [
                'eleve_id' => $validated['eleve_id'],
                'date_presence' => $validated['date_presence'] ?? now()->toDateString(),
            ],
            [
                'statut' => $validated['statut'],
            ]
        );

        $presence->load('eleve');
        $notification = null;

        if (in_array($presence->statut, ['A', 'R'], true)) {
            $notification = $notifications->sendAbsenceSms($presence->eleve, $presence->statut);
        }

        return response()->json([
            'message' => 'Presence enregistree.',
            'data' => $presence,
            'notification' => $notification,
        ], $presence->wasRecentlyCreated ? 201 : 200);
    }
}
