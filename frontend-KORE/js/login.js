document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('.form-login');

  if (!loginForm) return;

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation(); 

    const email = loginForm.querySelector('input[name="userEmail"]').value;
    const password = loginForm.querySelector('input[name="userPassword"]').value;

    if (!email || !password) {
      alert('Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await fetch(
        'http://localhost/backend/public/api/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ email, password })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Credenciales incorrectas');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      window.location.href = '../index.html';

    } catch (error) {
      console.error(error);
      alert('Error de conexión con el servidor');
    }
  });
});
