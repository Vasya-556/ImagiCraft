import React, { useState, useEffect } from 'react';

function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true); 
    } else {
      setIsLoggedIn(false); 
    }
  }, []); 

  const handleGenerateImages = async () => {
    setLoading(true);
    setError('');
    setImages([]);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/generate_images/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`, 
        },
        body: JSON.stringify({
          prompt: prompt,
          isLogged: isLoggedIn,  
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate images');
      }

      const data = await response.json();

      if (data.status === 'success') {
        setImages(data.images);
      } else {
        throw new Error(data.message || 'Error generating images');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Image Generator</h1>
      {isLoggedIn ? <p>Logged in</p> : <p>Not logged in</p>} {/* Check if logged in */}

      <div>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter image prompt"
        />
        <button onClick={handleGenerateImages} disabled={loading || !prompt}>
          {loading ? 'Generating...' : 'Generate Images'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
        {images.length > 0 &&
          images.map((imageUrl, index) => (
            <div key={index} style={{ margin: '10px' }}>
              <img src={imageUrl} alt={`Generated ${index + 1}`} width="300" />
            </div>
          ))}
      </div>
    </div>
  );
}

export default ImageGenerator;
