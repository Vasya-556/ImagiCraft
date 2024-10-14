import React, { useState, useEffect } from 'react';

function History() {
  const [history, setHistory] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserId(decodedToken.user_id);
    }

    const fetchHistory = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user_history/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: userId,
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
  }, [userId]);

  const handleDownload = async (imageUrl) => {
    const response = await fetch(imageUrl, {
      method: 'GET',
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = imageUrl.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      alert('Failed to download image');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
      return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
  <div className="image-history">
    <div style={{ marginTop: '20px' }}>
      {Object.keys(history).length === 0 ? (
        <p className='NoHistory'>No history found.</p>
          ) : (
        Object.entries(history).map(([prompt, images]) => (
          <div key={prompt} className="history-entry">
            <h2 className="history-prompt">Prompt: {prompt}</h2>
            <div className="history-images">
              {images.map((item) => (
                <div key={item.id} className="history-image-item">
                  <img src={item.image_url} alt="" className="history-image" />
                  <button 
                    onClick={() => handleDownload(item.image_url)} 
                    className="history-download-button">
                    Download
                  </button>
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