import { useState, useRef } from 'react';
import JSZip from 'jszip';

function FileCompressionApp() {
  const [selectedFiles, setSelectedFiles] = useState([]); // Array to store files
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    setSelectedFiles([...selectedFiles, ...event.target.files]); // Add to existing array
  };

  const handleCompress = async () => {
    setIsCompressing(true);
    const zip = new JSZip();

    // Add each file to the zip
    selectedFiles.forEach((file) => {
      zip.file(file.name, file); 
    });

    const compressedBlob = await zip.generateAsync({ type: 'blob' });

    // Trigger download
    const url = URL.createObjectURL(compressedBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'compressed.zip';
    document.body.appendChild(link);
    link.click();

    setIsCompressing(false);
    setSelectedFiles([]); // Clear the selected files after compression
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  return (
    <div className='container'>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className='file-input'/> 
      {selectedFiles.length > 0 && (
  <ul className='file-list'> 
    {selectedFiles.map((file, index) => (
      <li key={index}>
        {file.name} 
        <button onClick={() => handleRemoveFile(index)}>Remove</button>
      </li>
    ))}
  </ul>
)}
      <button onClick={handleCompress} disabled={!selectedFiles.length || isCompressing}>
        {isCompressing ? 'Compressing...' : 'Compress'}
      </button>
    </div>
  );
}

export default FileCompressionApp;
