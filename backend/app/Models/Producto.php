<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $table = 'producto';
protected $primaryKey = 'ID_producto';
public $timestamps = false;

protected $fillable = [
    'nombre',
    'descripcion',
    'precio',
    'ID_categoria',
    'imagen_url',
    'fecha_ingreso',
    'fecha_actualizacion'
];
    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'ID_categoria');
    }
}