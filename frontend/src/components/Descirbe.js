import React, { useState } from 'react';

function Describe() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setResponse('');
    setError('');
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select an image file first.');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const res = await fetch('http://127.0.0.1:8000/api/analyze_image/', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to analyze image');
      }

      const data = await res.json();
      if (data.status === 'success') {
        setResponse(data.response);
      } else {
        throw new Error(data.message || 'Error from API');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="describe-container">
      <h2>Upload Image to Describe</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} className='describe-image-input'/>

      <button onClick={handleSubmit} disabled={loading || !selectedFile} className='describe-button'>
        {loading ? 'Analyzing...' : 'Analyze Image'}
      </button>

      {response && (
        <div className="response-box">
          <h3>AI Response:</h3>
          <p>{response}</p>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Describe;