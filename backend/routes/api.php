<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\InventarioController;
use App\Http\Controllers\Api\PedidoController;
use App\Http\Controllers\Api\UsuarioController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);


Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user()->load('rol');
});

Route::get('/productos', [ProductoController::class, 'index']);
Route::get('/productos/{id}', [ProductoController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/productos', [ProductoController::class, 'store']);
    Route::put('/productos/{id}', [ProductoController::class, 'update']);
    Route::delete('/productos/{id}', [ProductoController::class, 'destroy']);
});

Route::get('/inventario/producto/{id}', [InventarioController::class, 'byProducto']);

Route::post('/pedidos', [PedidoController::class, 'store'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->get('/pedidos/mis-pedidos', [PedidoController::class, 'misPedidos']
);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/usuarios', [UsuarioController::class, 'index']);
    Route::delete('/usuarios/{id}', [UsuarioController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->put('/usuarios/{id}', [UsuarioController::class, 'update']
);

Route::middleware('auth:sanctum')->get('/pedidos/{id}/detalle', [PedidoController::class, 'detallePedido']
);

Route::middleware('auth:sanctum')->put('/usuarios/{id}/rol', [UsuarioController::class, 'cambiarRol']
);