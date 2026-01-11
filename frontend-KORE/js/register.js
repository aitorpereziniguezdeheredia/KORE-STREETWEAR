document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.querySelector('.form-register');

  if (!registerForm) return;

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const nombre = registerForm.querySelector('input[name="userName"]').value;
    const email = registerForm.querySelector('input[name="userEmail"]').value;
    const password = registerForm.querySelector('input[name="userPassword"]').value;
    const telefono = registerForm.querySelector('input[name="phone"]').value;

    if (!nombre || !email || !password) {
      alert('Todos los campos obligatorios deben rellenarse');
      return;
    }

    try {
      const response = await fetch(
        'http://localhost/backend/public/api/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            nombre,
            email,
            password,
            telefono
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Error al registrarse');
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
