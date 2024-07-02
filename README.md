Sure, here’s a detailed and structured README for your project:

---

# Network Tool

Network Tool is a web application that allows users to fetch and analyze network requests from a given URL, similar to the network tab in Chrome DevTools. The application consists of a Node.js backend and a React frontend.

## Features

- Input a URL to fetch network data.
- Display HTML content and network requests categorized by type (CSS, JS, XHR, Images, Documents).
- Loading spinner while fetching data.
- Simple and intuitive user interface.

## Technologies Used

- Node.js
- Express
- Puppeteer
- React
- Axios

## Prerequisites

Make sure you have Node.js and npm installed on your machine.

## Getting Started

### Backend Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/network-tool.git
   cd network-tool
   ```

2. **Install backend dependencies:**

   ```bash
   npm install
   ```

3. **Create `index.js` in the backend directory with the following content:**

   ```javascript
   const express = require('express');
   const puppeteer = require('puppeteer');
   const cors = require('cors');

   const app = express();
   const port = 3000;

   app.use(cors());

   app.get('/scrape', async (req, res) => {
     const { url } = req.query;
     if (!url) {
       return res.status(400).send('Please provide a URL');
     }

     const browser = await puppeteer.launch();
     const page = await browser.newPage();

     const networkData = {
       html: '',
       css: [],
       js: [],
       xhr: [],
       images: [],
       docs: []
     };

     page.on('request', request => {
       const type = request.resourceType();
       const requestUrl = request.url();

       switch (type) {
         case 'stylesheet':
           networkData.css.push(requestUrl);
           break;
         case 'script':
           networkData.js.push(requestUrl);
           break;
         case 'xhr':
           networkData.xhr.push(requestUrl);
           break;
         case 'image':
           networkData.images.push(requestUrl);
           break;
         case 'document':
           networkData.docs.push(requestUrl);
           break;
       }
     });

     try {
       await page.goto(url, { waitUntil: 'networkidle2' });
       networkData.html = await page.content();
       await browser.close();

       res.json(networkData);
     } catch (error) {
       await browser.close();
       res.status(500).send('Error while scraping the page');
     }
   });

   app.listen(port, () => {
     console.log(`Server is running on http://localhost:${port}`);
   });
   ```

4. **Start the backend server:**

   ```bash
   node index.js
   ```

### Frontend Setup

1. **Navigate to the client directory:**

   ```bash
   cd network-tool-client
   ```

2. **Install frontend dependencies:**

   ```bash
   npm install
   ```

3. **Create `src/App.js` with the following content:**

   ```jsx
   import React, { useState } from 'react';
   import axios from 'axios';
   import './App.css';

   function App() {
     const [url, setUrl] = useState('');
     const [data, setData] = useState(null);
     const [displayType, setDisplayType] = useState('html');
     const [loading, setLoading] = useState(false);

     const fetchData = async () => {
       setLoading(true);
       try {
         const response = await axios.get(`https://network-tool-server-production.up.railway.app/scrape?url=${url}`);
         setData(response.data);
       } catch (error) {
         console.error('Error fetching data', error);
       }
       setLoading(false);
     };

     const handleUrlChange = (event) => {
       setUrl(event.target.value);
     };

     const handleButtonClick = (type) => {
       setDisplayType(type);
     };

     const renderData = () => {
       if (loading) {
         return <div className="spinner"></div>;
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
   ```

4. **Create `src/App.css` with the following content:**

   ```css
   .App {
     text-align: center;
     padding: 20px;
   }

   input {
     width: 300px;
     padding: 8px;
     margin: 10px;
   }

   button {
     padding: 8px 16px;
     margin: 5px;
     cursor: pointer;
   }

   .buttons {
     margin: 20px 0;
   }

   .data-display {
     text-align: left;
     margin-top: 20px;
     border-top: 1px solid #ccc;
     padding-top: 20px;
   }

   pre {
     white-space: pre-wrap;
     word-wrap: break-word;
   }

   .spinner {
     margin: 20px auto;
     border: 8px solid #f3f3f3;
     border-top: 8px solid #3498db;
     border-radius: 50%;
     width: 60px;
     height: 60px;
     animation: spin 2s linear infinite;
   }

   @keyframes spin {
     0% { transform: rotate(0deg); }
     100% { transform: rotate(360deg); }
   }
   ```

5. **Start the React application:**

   ```bash
   npm start
   ```

### Usage

1. **Open your web browser and navigate to `http://localhost:3000`.**
2. **Enter a URL into the input field and click the "Fetch" button.**
3. **Use the buttons to view different types of network data (HTML, CSS, JS, XHR, Images, Documents).**
4. **While data is being fetched, a spinner will be displayed.**

## License

This project is licensed under the MIT License.

---

Feel free to replace the repository URL and any other details as needed. This README provides a comprehensive guide for setting up, running, and using your Network Tool application.