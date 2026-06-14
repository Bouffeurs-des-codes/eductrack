<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('devoirs', function (Blueprint $table): void {
            $table->id();
            $table->string('titre');
            $table->string('classe', 60);
            $table->string('matiere', 120);
            $table->text('description')->nullable();
            $table->date('date_limite')->nullable();
            $table->timestamps();

            $table->index('classe');
            $table->index('date_limite');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('devoirs');
    }
};
