<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Devoir extends Model
{
    protected $fillable = [
        'titre',
        'classe',
        'matiere',
        'description',
        'date_limite',
    ];

    protected $casts = [
        'date_limite' => 'date:Y-m-d',
    ];
}
