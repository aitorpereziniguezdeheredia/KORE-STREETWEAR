<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    // público
    public function index()
    {
        return Producto::with('categoria')->get();
    }

    public function show($id)
    {
        return Producto::with('categoria')->findOrFail($id);
    }

    // solo admin
    public function store(Request $request)
{
    $data = $request->validate([
        'nombre' => 'required|string|max:255',
        'descripcion' => 'nullable|string',
        'precio' => 'required|numeric',
        'imagen' => 'nullable|image|max:2048',
        'ID_categoria' => 'required|integer'
    ]);

    // Imagen (opcional)
    $imagenUrl = null;
    if ($request->hasFile('imagen')) {
        $ruta = $request->file('imagen')->store('productos', 'public');
        $imagenUrl = asset('storage/' . $ruta);
    }

    $producto = Producto::create([
        'nombre' => $data['nombre'],
        'descripcion' => $data['descripcion'] ?? null,
        'precio' => $data['precio'],
        'ID_categoria' => 1,
        'imagen_url' => $imagenUrl,
        'fecha_ingreso' => now()
    ]);

    return response()->json($producto, 201);
}

    public function update(Request $request, $id)
    {
        $this->authorizeAdmin($request);

        $producto = Producto::findOrFail($id);
        $producto->update($request->all());

        return response()->json($producto);
    }

    public function destroy(Request $request, $id)
    {
        $this->authorizeAdmin($request);

        Producto::findOrFail($id)->delete();
        return response()->json(['message' => 'Producto eliminado']);
    }

    // protección admin
    private function authorizeAdmin(Request $request)
    {
        if ($request->user()->ID_rol !== 1) {
            abort(403, 'No autorizado');
        }
    }
}

