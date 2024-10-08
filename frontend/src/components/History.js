import React, { useState, useEffect } from 'react';

function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const response = await fetch('http://127.0.0.1:8000/api/user_history/');
      const data = await response.json();

      if (data.status === 'success') {
        setHistory(data.history);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <h1>Image History</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
        {history.map((item, index) => (
          <div key={item.id} style={{ margin: '10px' }}>
            <img src={item.image_url} alt={`History ${index + 1}`} width="300" />
            <p>Prompt: {item.prompt}</p>
            <a href={item.image_url} download={`history_image_${index + 1}.png`}>Download</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History