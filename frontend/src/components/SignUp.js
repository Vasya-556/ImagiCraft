import React, { useState } from 'react';

function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
  
    const handleSignup = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
  
      const data = await response.json();
      if (data.status === 'success') {
        setMessage('Signup successful! You can now login.');
      } else {
        setMessage(data.message);
      }
    };
  
    return (
      <div className='auth-page'>
        <div className="auth-container">
          <h1>Sign up</h1>
          <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="auth-input"
          />
          <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
          />
          <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
          />
          <button onClick={handleSignup} className="auth-button">Signup</button>
          {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
    );
}

export default SignUp