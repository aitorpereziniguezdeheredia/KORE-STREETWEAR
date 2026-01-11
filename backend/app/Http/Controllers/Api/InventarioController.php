<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inventario;

class InventarioController extends Controller
{
    /**
     * Devuelve el inventario de un producto (tallas, colores y stock)
     */
    public function byProducto($id)
    {
        return Inventario::where('ID_producto', $id)
            ->where('stock', '>', 0)
            ->get([
                'talla',
                'color',
                'stock'
            ]);
    }
}
