(function () {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '../views/inicio_registro.html';
  }
})();
