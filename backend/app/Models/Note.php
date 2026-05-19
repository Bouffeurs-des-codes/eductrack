<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Note extends Model
{
    protected $fillable = [
        'eleve_id',
        'type',
        'valeur',
        'date_note',
    ];

    protected $casts = [
        'valeur' => 'float',
        'date_note' => 'date:Y-m-d',
    ];

    public function eleve(): BelongsTo
    {
        return $this->belongsTo(Eleve::class);
    }
}
