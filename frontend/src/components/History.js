import React, { useState, useEffect } from 'react';

function History() {
  const [history, setHistory] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // State to hold user ID

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT to get payload
      setUserId(decodedToken.user_id); // Extract user ID from token payload
    }

    const fetchHistory = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user_history/', {
          method: 'POST', // Changed to POST
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Add authorization if needed
          },
          body: JSON.stringify({
            user_id: userId, // Send user ID to backend
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }

        const data = await response.json();
        if (data.status === 'success') {
          setHistory(data.history);
        } else {
          throw new Error(data.message || 'Error fetching history');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchHistory();
    }
  }, [userId]); // Fetch history whenever userId changes

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h1>Image History</h1>
      <div style={{ marginTop: '20px' }}>
        {Object.keys(history).length === 0 ? (
          <p>No history found.</p>
        ) : (
          Object.entries(history).map(([prompt, images]) => (
            <div key={prompt} style={{ marginBottom: '20px' }}>
              <h2>Prompt: {prompt}</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {images.map((item, index) => (
                  <div key={item.id} style={{ margin: '10px' }}>
                    <img src={item.image_url} alt={`Generated image for prompt: ${prompt}`} width="300" />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default History;
