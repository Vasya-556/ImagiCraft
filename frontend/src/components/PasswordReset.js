import React, { useState } from 'react';

function PasswordReset({ email }) {
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');

  const handleRequestCode = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/request_password_reset/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setMessage(data.message);
      if (data.status === 'success') {
        setStep(2); 
      }
    } catch (error) {
      setMessage('Error sending verification code');
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/change_password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode.toString(), new_password: newPassword }), 
      });
      const data = await response.json();
      setMessage(data.message);
      if (data.status === 'success') {
        setStep(1); 
      }
    } catch (error) {
      setMessage('Error changing password');
    }
  };

  return (
    <div>
      <h2>Password Reset</h2>
      {step === 1 ? (
        <div>
          <button onClick={handleRequestCode}>Request Verification Code</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
          <button onClick={handleChangePassword}>Change Password</button>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default PasswordReset;