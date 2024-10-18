import React from 'react';

function LogoutButton() {
  const handleLogout = async () => {
    try {
      const response = await fetch('https://imagicraft.pythonanywhere.com/api/signout/', {
        method: 'POST', 
        credentials: 'include', 
      });

      
      const data = await response.json();

      if (data.status === 'success') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token'); 
        window.location.reload();
        // navigate('/'); 
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return <button onClick={handleLogout}
      className='AuthButton'>
      Logout
    </button>;
}

export default LogoutButton;
