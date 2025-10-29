import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PDFs() {
  const [pdfs, setPDFs] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      const response = await axios.get('/api/pdfs');
      setPDFs(response.data);
    } catch (error) {
      console.error('Failed to fetch PDFs:', error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('/api/pdfs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchPDFs();
      setFile(null);
    } catch (error) {
      console.error('Failed to upload PDF:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/pdfs', { data: { id } });
      fetchPDFs();
    } catch (error) {
      console.error('Failed to delete PDF:', error);
    }
  };

  return (
    <div>
      <h1>PDF Management</h1>

      <form onSubmit={handleUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Upload PDF</button>
      </form>

      <ul>
        {pdfs.map((pdf) => (
          <li key={pdf.id}>
            {pdf.name} - <a href={pdf.filePath} target="_blank" rel="noopener noreferrer">View</a>
            <button onClick={() => handleDelete(pdf.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}