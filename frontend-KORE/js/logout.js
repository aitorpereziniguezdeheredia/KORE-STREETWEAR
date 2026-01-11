document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('logout');

  if (!btn) return;

  btn.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '../views/inicio_registro.html';
  });
});
