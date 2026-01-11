<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    // ============================
    // LISTAR USUARIOS (ADMIN)
    // ============================
    public function index()
    {
        $user = auth()->user();

        if (!$user || $user->ID_rol !== 1) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $usuarios = Usuario::with('rol')->get();

        return response()->json($usuarios);
    }

    // ============================
    // ELIMINAR USUARIO (ADMIN)
    // ============================
    public function destroy($id)
    {
        $user = auth()->user();

        if (!$user || $user->ID_rol !== 1) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $usuario = Usuario::findOrFail($id);

        // Evitar que el admin se borre a sí mismo
        if ($usuario->ID_usuario === $user->ID_usuario) {
            return response()->json([
                'error' => 'No puedes eliminar tu propio usuario'
            ], 400);
        }

        $usuario->delete();

        return response()->json(['message' => 'Usuario eliminado']);
    }

    // ============================
    // EDITAR USUARIO (ADMIN)
    // ============================
    public function update(Request $request, $id)
    {
        $userAuth = auth()->user();

        if (!$userAuth || $userAuth->ID_rol !== 1) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $usuario = Usuario::findOrFail($id);

        $request->validate([
            'nombre'   => 'required|string|max:255',
            'email'    => 'required|email|max:255',
            'telefono' => 'nullable|string|max:50',
            'ID_rol'   => 'required|in:1,2'
        ]);

        $usuario->update([
            'nombre'   => $request->nombre,
            'email'    => $request->email,
            'telefono' => $request->telefono,
            'ID_rol'   => $request->ID_rol
        ]);

        return response()->json([
            'message' => 'Usuario actualizado correctamente'
        ]);
    }

    // ============================
    // CAMBIAR ROL USUARIO (ADMIN)
    // ============================
    public function cambiarRol(Request $request, $id)
    {
        $admin = auth()->user();

        if (!$admin || $admin->ID_rol !== 1) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $request->validate([
            'ID_rol' => 'required|in:1,2'
        ]);

        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        // Evitar que el admin se quite su propio rol
        if ($usuario->ID_usuario === $admin->ID_usuario) {
            return response()->json([
                'error' => 'No puedes cambiar tu propio rol'
            ], 400);
        }

        $usuario->ID_rol = $request->ID_rol;
        $usuario->save();

        return response()->json([
            'message' => 'Rol actualizado correctamente',
            'usuario' => $usuario
        ]);
    }
}
