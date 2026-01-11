document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const response = await fetch(
      'http://localhost/backend/public/api/me',
      {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json'
        }
      }
    );

    const user = await response.json();

    localStorage.setItem('usuario', JSON.stringify(user));
  } catch (error) {
    console.error('Error cargando usuario', error);
  }
});
