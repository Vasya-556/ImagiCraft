import React from 'react';

function LogoutButton() {
  const handleLogout = async () => {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token'); 
      window.location.reload();
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
