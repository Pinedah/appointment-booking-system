// Script principal para la aplicación
document.addEventListener('DOMContentLoaded', function() {
  // Verificar si hay un usuario autenticado
  const token = localStorage.getItem('token');
  
  if (token) {
    // Si hay un token, actualizar la interfaz para un usuario autenticado
    updateNavForAuthenticatedUser();
    
    // Verificar validez del token
    verifyAuthentication();
  }
});

async function verifyAuthentication() {
  try {
    const response = await fetch('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      // Token inválido, eliminar y actualizar UI
      localStorage.removeItem('token');
      updateNavForUnauthenticatedUser();
      return;
    }
    
    const data = await response.json();
    
    // Guardar información del usuario
    localStorage.setItem('user', JSON.stringify(data.user));
    
  } catch (error) {
    console.error('Error al verificar autenticación:', error);
  }
}

function updateNavForAuthenticatedUser() {
  const nav = document.querySelector('.nav ul');
  if (!nav) return;
  
  // Limpiar elementos actuales
  nav.innerHTML = '';
  
  // Agregar elementos para usuario autenticado
  const links = [
    { text: 'Inicio', href: '/' },
    { text: 'Mis Citas', href: '/patient/appointments' },
    { text: 'Perfil', href: '/patient/profile' },
    { text: 'Cerrar Sesión', href: '#', id: 'logout-link' }
  ];
  
  links.forEach(link => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = link.text;
    a.href = link.href;
    if (link.id) a.id = link.id;
    li.appendChild(a);
    nav.appendChild(li);
  });
  
  // Agregar event listener para cerrar sesión
  document.getElementById('logout-link').addEventListener('click', logout);
}

function updateNavForUnauthenticatedUser() {
  const nav = document.querySelector('.nav ul');
  if (!nav) return;
  
  // Limpiar elementos actuales
  nav.innerHTML = '';
  
  // Agregar elementos para usuario no autenticado
  const links = [
    { text: 'Inicio', href: '/' },
    { text: 'Iniciar Sesión', href: '/login' },
    { text: 'Registrarse', href: '/register' }
  ];
  
  links.forEach(link => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = link.text;
    a.href = link.href;
    li.appendChild(a);
    nav.appendChild(li);
  });
}

async function logout(e) {
  e.preventDefault();
  
  try {
    await fetch('/api/auth/logout');
    
    // Limpiar almacenamiento local
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Actualizar interfaz
    updateNavForUnauthenticatedUser();
    
    // Redireccionar a inicio
    window.location.href = '/';
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
}