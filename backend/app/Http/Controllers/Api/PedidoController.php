<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pedido;
use App\Models\DetallePedido;
use Illuminate\Support\Facades\DB;

class PedidoController extends Controller
{
    /**
     * Crear un pedido con sus detalles
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        // VALIDACIÓN
        $request->validate([
            'subtotal' => 'required|numeric',
            'costo_envio' => 'required|numeric',
            'total' => 'required|numeric',
            'items' => 'required|array|min:1',
        ]);

        // OBTENER DIRECCIÓN PRINCIPAL DEL USUARIO
        $direccion = DB::table('direccion')
            ->where('ID_usuario', $user->ID_usuario)
            ->where('es_principal_envio', 1)
            ->first();

        if (!$direccion) {
            return response()->json([
                'error' => 'El usuario no tiene dirección de envío'
            ], 400);
        }

        DB::beginTransaction();

        try {
            // CREAR PEDIDO
            $pedido = Pedido::create([
                'ID_usuario' => $user->ID_usuario,
                'fecha_pedido' => now(),
                'estado_pedido' => 'pendiente',
                'ID_direccion_envio' => $direccion->ID_direccion,
                'ID_direccion_facturacion' => $direccion->ID_direccion,
                'subtotal' => $request->subtotal,
                'descuento_total' => 0,
                'costo_envio' => $request->costo_envio,
                'total' => $request->total,
            ]);

            // CREAR DETALLE DEL PEDIDO 
            foreach ($request->items as $item) {
                DetallePedido::create([
                    'ID_pedido' => $pedido->ID_pedido,
                    'ID_producto' => $item['ID_producto'],
                    'talla' => $item['talla'] ?? null,
                    'color' => $item['color'] ?? null,
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $item['precio_unitario'],

    ]);
}

            DB::commit();

            return response()->json([
                'message' => 'Pedido creado correctamente',
                'pedido' => $pedido
            ], 201);

        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'error' => 'Error interno',
                'detalle' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Listar pedidos del usuario autenticado
     */
    public function misPedidos()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        $pedidos = Pedido::with(['detalles.producto'])
            ->where('ID_usuario', $user->ID_usuario)
            ->orderBy('fecha_pedido', 'desc')
            ->get();

        return response()->json($pedidos);
    }

    /**
     * Detalle de un pedido concreto
     */
    public function detallePedido($id)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        $pedido = Pedido::with(['detalles.producto'])
            ->where('ID_pedido', $id)
            ->where('ID_usuario', $user->ID_usuario)
            ->first();

        if (!$pedido) {
            return response()->json(['error' => 'Pedido no encontrado'], 404);
        }

        if ($pedido->detalles->isEmpty()) {
            return response()->json([
                'pedido_id' => $pedido->ID_pedido,
                'productos' => []
            ]);
        }

        $productos = $pedido->detalles->map(function ($detalle) {
            return [
                'nombre' => $detalle->producto->nombre ?? 'Producto eliminado',
                'imagen_url' => $detalle->producto->imagen_url ?? '',
                'talla' => $detalle->talla,
                'color' => $detalle->color,
                'cantidad' => $detalle->cantidad,
                'precio_unitario' => $detalle->precio_unitario
            ];
        });

        return response()->json([
            'pedido_id' => $pedido->ID_pedido,
            'productos' => $productos
        ]);
    }
}
