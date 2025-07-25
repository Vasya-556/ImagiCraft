import React, { useState, useEffect } from 'react';
import PasswordReset from './PasswordReset';

function Profile() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: ''
  });
  const [updatedUserData, setUpdatedUserData] = useState(userData);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserId(decodedToken.user_id);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/get_user_data/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId }),
        });
        const data = await response.json();
        if (data.status === 'success') {
          setUserData(data.data);
          setUpdatedUserData(data.data); 
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleUpdate = async () => {
    try {
      const response = await fetch('https://imagicraft.pythonanywhere.com/api/update_user_data/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, ...updatedUserData }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setSuccessMessage(data.message);
        setUserData(updatedUserData); 
      } else {
        console.error('Failed to update user data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="profile-page">
    <div className="profile-container">
        {isLoggedIn ? (
            <div>
                <h2>User Profile</h2>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={updatedUserData.username}
                        onChange={(e) => setUpdatedUserData({ ...updatedUserData, username: e.target.value })}
                        className="profile-input"
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={updatedUserData.email}
                        onChange={(e) => setUpdatedUserData({ ...updatedUserData, email: e.target.value })}
                        className="profile-input"
                    />
                </div>
                <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        value={updatedUserData.first_name}
                        onChange={(e) => setUpdatedUserData({ ...updatedUserData, first_name: e.target.value })}
                        className="profile-input"
                    />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        value={updatedUserData.last_name}
                        onChange={(e) => setUpdatedUserData({ ...updatedUserData, last_name: e.target.value })}
                        className="profile-input"
                    />
                </div>
                <button onClick={handleUpdate} className="update-button">Update Profile</button>
                {successMessage && <p className="success-message">{successMessage}</p>}
                <PasswordReset email={userData.email} />
            </div>
        ) : (
            <p>Not logged in</p>
        )}
    </div>
</div>
  );
}

export default Profile;