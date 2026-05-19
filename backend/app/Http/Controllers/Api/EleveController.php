<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Eleve;
use Illuminate\Http\JsonResponse;

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
}
