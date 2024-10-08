import React from 'react';

function LogoutButton() {
  const handleLogout = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/signout/', {
        method: 'POST', 
        credentials: 'include', 
      });

      
      const data = await response.json();

      if (data.status === 'success') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token'); 
        // navigate('/'); 
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;
