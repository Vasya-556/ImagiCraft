import React, { useState, useEffect } from 'react';
import { Square } from 'ldrs/react'
import 'ldrs/react/Square.css'

function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [selectedModel, setSelectedModel] = useState('model1');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserId(decodedToken.user_id);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleGenerateImages = async () => {
    setLoading(true);
    setError('');

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
          user_id: userId,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate images');
      }

      const data = await response.json();

      if (data.status === 'success') {
        const newEntry = {
          prompt: prompt,
          images: data.images,
        };

        setChatHistory((prevConversation) => [...prevConversation, newEntry]);
        setPrompt('');
      } else {
        throw new Error(data.message || 'Error generating images');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="ImageGenerator">
      <div className="chat-history">
        {chatHistory.map((entry, index) => (
          <div key={index} className="chat-entry">
            <p className="chat-prompt">{entry.prompt}</p>
            <div className="chat-images">
              {entry.images.map((imageUrl, imgIndex) => (
                <div key={imgIndex} className="chat-image-item">
                  <img src={imageUrl} alt={`Generated ${imgIndex + 1}`} className="chat-image" />
                  <button onClick={() => handleDownload(imageUrl)} className="download-button">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className='Loading'>
      {loading ? <Square
        size="35"
        stroke="5"
        strokeLength="0.25"
        bgOpacity="0.1"
        speed="1.2"
        color="purple" 
      /> : <></>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter image prompt"
          className="input-field"
        />
        <select 
          value={selectedModel} 
          onChange={(e) => setSelectedModel(e.target.value)}
          className="select-model"> 
          <option value="model1">Default</option>
          <option value="model2">Medieval</option>
          <option value="model3">Cyberpunk</option>
          <option value="model4">White and black</option>
          {/* <option value="model2">Surreal</option> */}
          {/* <option value="model3">Photo</option> */}
        </select>
        <button onClick={handleGenerateImages} disabled={loading || !prompt} className="generate-button">
          {loading ? 'Generating...' : 'Generate Images'}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default ImageGenerator;