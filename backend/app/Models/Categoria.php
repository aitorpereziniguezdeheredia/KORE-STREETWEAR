<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    protected $table = 'categoria';
    protected $primaryKey = 'ID_categoria';
    public $timestamps = false;

    protected $fillable = [
        'nombre_categoria',
        'descripcion'
    ];
}

