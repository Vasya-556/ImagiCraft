import React, { useState, useEffect } from 'react';
import { Square } from 'ldrs/react';
import 'ldrs/react/Square.css';

function PromptGenerator() {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

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
  
  const handleGeneratePrompt = async () => {
    setLoading(true);
    setError('');
    setCopiedIndex(null);

    try {
      const response = await fetch('https://imagicraft.pythonanywhere.com/api/generate_prompts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt,
            isLogged: isLoggedIn,
            user_id: userId,
          }),
      });

      if (!response.ok) throw new Error('Failed to generate prompt');

      const data = await response.json();

      if (data.status === 'success') {
        setChatHistory((prev) => [...prev, data.response]);
        setPrompt('');
      } else {
        throw new Error(data.message || 'Error generating prompt');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="ImageGenerator">
      <div className="chat-history">
        {chatHistory.map((item, index) => (
          <div key={index} className="chat-entry">
            <p className="chat-prompt">Generated Prompt:</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <p className="chat-prompt" style={{ flex: 1 }}>{item}</p>
              <button
                className="copy-button"
                onClick={() => handleCopyPrompt(item, index)}
              >
                {copiedIndex === index ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="Loading">
        {loading && (
          <Square
            size="35"
            stroke="5"
            strokeLength="0.25"
            bgOpacity="0.1"
            speed="1.2"
            color="cyan"
          />
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter idea to turn into visual prompt"
          className="input-field"
        />
        <button
          onClick={handleGeneratePrompt}
          disabled={loading || !prompt}
          className="generate-button"
        >
          {loading ? 'Generating...' : 'Generate Prompt'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default PromptGenerator;