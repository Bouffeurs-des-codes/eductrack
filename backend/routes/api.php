<?php

use App\Http\Controllers\Api\AnalyseController;
use App\Http\Controllers\Api\EleveController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\PresenceController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => ['status' => 'ok', 'app' => 'EduTrack']);

Route::get('/eleves', [EleveController::class, 'index']);
Route::get('/analyses', [AnalyseController::class, 'index']);

Route::get('/presences', [PresenceController::class, 'index']);
Route::post('/presences', [PresenceController::class, 'store']);

Route::get('/notes', [NoteController::class, 'index']);
Route::post('/notes', [NoteController::class, 'store']);
