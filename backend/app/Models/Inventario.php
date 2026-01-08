<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventario extends Model
{
    protected $table = 'Inventario';
    protected $primaryKey = 'ID_inventario';
    public $timestamps = false;

    protected $fillable = [
        'ID_producto',
        'talla',
        'color',
        'stock'
    ];

    // Relación: Inventario pertenece a un Producto
    public function producto()
    {
        return $this->belongsTo(Producto::class, 'ID_producto', 'ID_producto');
    }
}
