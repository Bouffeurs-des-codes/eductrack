<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('presences', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('eleve_id')->constrained('eleves')->cascadeOnDelete();
            $table->enum('statut', ['P', 'A', 'R']);
            $table->date('date_presence');
            $table->timestamps();

            $table->unique(['eleve_id', 'date_presence']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('presences');
    }
};
