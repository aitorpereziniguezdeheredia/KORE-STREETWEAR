<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetallePedido extends Model
{
    protected $table = 'pedido_detalle';
    protected $primaryKey = 'ID_pedido_detalle';
    public $timestamps = false;

    protected $fillable = [
        'ID_pedido',
        'ID_producto',
        'talla',
        'color',
        'cantidad',
        'precio_unitario'
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'ID_producto');
    }
}

