import React, { useState } from 'react';
import './Upload.css';

const Upload: React.FC = () => {
  const [isFileUpload, setIsFileUpload] = useState<boolean>(false);
  const [htmlFile, setHtmlFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [SpecificationsFile, setSpecificationsFile] = useState<File | null>(null);

  // Only one of htmlFile or url can be active at a time
  const onHtmlFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setHtmlFile(e.target.files[0]);
      setUrl(''); // clear URL input if file selected
    }
  };

  const onUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (e.target.value) {
      setHtmlFile(null); // clear file if URL entered
    }
  };

  const onDesignFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDesignFile(e.target.files[0]);
    }
  };

  const onSpecificationsFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSpecificationsFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
  };

  return (
    <form className="upload-container" onSubmit={handleSubmit}>
      <button className='toggle-upload-btn' onClick={() => {setIsFileUpload(prev => !prev)}}>{isFileUpload? "Enter URL": "Upload HTML File"}</button>

      {isFileUpload && <label className="upload-label">
        Upload HTML File:
        <input
          type="file"
          accept=".html"
          onChange={onHtmlFileChange}
          disabled={!!url}
        />
      </label>}

      {!isFileUpload && <label className="upload-label">
        Enter URL:
        <input
          type="url"
          value={url}
          onChange={onUrlChange}
          placeholder="https://example.com"
          disabled={!!htmlFile}
        />
      </label>}

      <label className="upload-label">
        Optional: Upload design file:
        <input type="file" onChange={onDesignFileChange} />
      </label>

      <label className="upload-label">
        Optional: Specifications design file:
        <input type="file" onChange={onSpecificationsFileChange} />
      </label>

      <button type="submit" disabled={!htmlFile && !url}>
        Submit
      </button>
      
    </form>

  );
};

export default Upload;
