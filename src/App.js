import React from 'react';
import './App.css';
import PdfUploader from './components/pydict';  // Ensure the correct import path

function App() {
  return (
    <div className="App">
      <h1>PDFSage</h1>
      <PdfUploader />  {/* Use the imported component */}
    </div>
  );
}

export default App;
