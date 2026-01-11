document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario) return;

  const nombreSpan = document.getElementById('nombreUsuario');
  if (nombreSpan) {
    nombreSpan.textContent = usuario.nombre;
  }

  // 🔐 CONTROL DE ROL
  if (usuario.ID_rol !== 1) {
  const adminItem = document.getElementById('menuUsuarios');
  if (adminItem) adminItem.style.display = 'none';
}

});

