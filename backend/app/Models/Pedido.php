<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $table = 'pedido';
    protected $primaryKey = 'ID_pedido';
    public $timestamps = false;

    protected $fillable = [
        'ID_usuario',
        'fecha_pedido',
        'estado_pedido',
        'ID_direccion_envio',
        'ID_direccion_facturacion',
        'subtotal',
        'descuento_total',
        'costo_envio',
        'total'
    ];

    public function detalles()
    {
        return $this->hasMany(DetallePedido::class, 'ID_pedido', 'ID_pedido');
    }

}

