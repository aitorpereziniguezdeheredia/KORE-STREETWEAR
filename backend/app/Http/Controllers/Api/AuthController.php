<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $usuario = Usuario::where('email', $request->email)->first();

        if (!$usuario || !Hash::check($request->password, $usuario->password_hash)) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'usuario' => $usuario
        ]);
    }

    public function register(Request $request)
{
    $request->validate([
        'nombre' => 'required|string|max:255',
        'email' => 'required|email|unique:Usuario,email',
        'password' => 'required|min:6',
        'telefono' => 'nullable|string|max:20',
    ]);

    // Separar nombre completo
    $partesNombre = explode(' ', trim($request->nombre), 2);
    $nombre = $partesNombre[0];
    $apellido = $partesNombre[1] ?? '';

    $usuario = Usuario::create([
        'ID_rol' => 2,
        'nombre' => $nombre,
        'apellido' => $apellido,
        'email' => $request->email,
        'password_hash' => Hash::make($request->password),
        'telefono' => $request->telefono,
        'fecha_registro' => now()
    ]);

    $token = $usuario->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Usuario registrado correctamente',
        'token' => $token,
        'usuario' => $usuario
    ], 201);
}

}
