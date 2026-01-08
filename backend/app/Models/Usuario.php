<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'usuario';  // Nombre de la tabla en la base de datos
    protected $primaryKey = 'ID_usuario';  // Clave primaria personalizada
    public $timestamps = false;  // Desactiva los timestamps si no los estás usando

    
    public $incrementing = true; 
    protected $keyType = 'int';  

    protected $fillable = [
        'ID_rol',
        'nombre',
        'apellido',
        'email',
        'password_hash',
        'telefono',
        'fecha_registro'
    ];

    protected $hidden = [
        'password_hash'
    ];

    // Relación con la tabla Rol
    public function rol()
    {
        return $this->belongsTo(Rol::class, 'ID_rol');
    }
}
