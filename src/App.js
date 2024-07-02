import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  const [displayType, setDisplayType] = useState('html');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingText((prev) => (prev === 'loading...' ? 'loading' : prev + '.'));
      }, 500);
    } else {
      setLoadingText('loading');
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://network-tool-server-production.up.railway.app/scrape?url=${url}`);
      setData(response.data);
    } catch (err) {
      setError('Error fetching data');
      console.error('Error fetching data', err);
    }
    setIsLoading(false);
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleButtonClick = (type) => {
    setDisplayType(type);
  };

  const renderData = () => {
    if (isLoading) {
      return <p>{loadingText}</p>;
    }

    if (error) {
      return <p>{error}</p>;
    }

    if (!data) {
      return <p>No data available. Enter a URL and click Fetch.</p>;
    }

    const displayData = data[displayType];
    if (typeof displayData === 'string') {
      return <pre>{displayData}</pre>;
    }

    return (
      <ul>
        {displayData.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="App">
      <h1>Network Tool</h1>
      <input
        type="text"
        value={url}
        onChange={handleUrlChange}
        placeholder="Enter URL"
      />
      <button onClick={fetchData}>Fetch</button>
      <div className="buttons">
        <button onClick={() => handleButtonClick('html')}>HTML</button>
        <button onClick={() => handleButtonClick('css')}>CSS</button>
        <button onClick={() => handleButtonClick('js')}>JS</button>
        <button onClick={() => handleButtonClick('xhr')}>XHR</button>
        <button onClick={() => handleButtonClick('images')}>Images</button>
        <button onClick={() => handleButtonClick('docs')}>Docs</button>
      </div>
      <div className="data-display">
        {renderData()}
      </div>
    </div>
  );
}

export default App;
