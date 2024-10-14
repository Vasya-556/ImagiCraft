import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSignin = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to sign in');
            }

            const data = await response.json();
            localStorage.setItem('access_token', data.access); 
            localStorage.setItem('refresh_token', data.refresh); 
            setMessage('Signin successful!');
            navigate('/'); 
            window.location.reload();
        } catch (error) {
            console.error('Signin error:', error);
            setMessage('Failed to fetch. Please try again.'); 
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1>Sign in</h1>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="auth-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input"
                />
                <button onClick={handleSignin} className="auth-button">Signin</button>
                {message && <p className="auth-message">{message}</p>}
            </div>
        </div>
    );
}

export default SignIn;
