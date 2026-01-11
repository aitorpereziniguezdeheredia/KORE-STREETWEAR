<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    protected $table = 'rol';
    protected $primaryKey = 'ID_rol';
    public $timestamps = false;

    protected $fillable = [
        'nombre'
    ];

    // (Opcional pero recomendable)
    public function usuarios()
    {
        return $this->hasMany(Usuario::class, 'ID_rol');
    }
}
