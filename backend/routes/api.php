<?php

use App\Http\Controllers\Api\AnalyseController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClasseController;
use App\Http\Controllers\Api\DevoirController;
use App\Http\Controllers\Api\EleveController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\ParentController;
use App\Http\Controllers\Api\PresenceController;
use App\Http\Controllers\Api\RapportController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => ['status' => 'ok', 'app' => 'EduTrack']);

Route::post('/login', [AuthController::class, 'login']);

Route::get('/eleves', [EleveController::class, 'index']);
Route::post('/eleves', [EleveController::class, 'store']);
Route::put('/eleves/{eleve}', [EleveController::class, 'update']);
Route::delete('/eleves/{eleve}', [EleveController::class, 'destroy']);

Route::apiResource('users', UserController::class)->except(['show']);
Route::apiResource('classes', ClasseController::class)->except(['show']);
Route::apiResource('devoirs', DevoirController::class)->except(['show']);

Route::get('/analyses', [AnalyseController::class, 'index']);
Route::get('/rapports', [RapportController::class, 'index']);
Route::get('/parent/enfants', [ParentController::class, 'enfants']);
Route::get('/parent/enfants/{eleve}', [ParentController::class, 'rapport']);

Route::get('/presences', [PresenceController::class, 'index']);
Route::post('/presences', [PresenceController::class, 'store']);

Route::get('/notes', [NoteController::class, 'index']);
Route::post('/notes', [NoteController::class, 'store']);
