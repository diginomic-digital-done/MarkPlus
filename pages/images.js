import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Images() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get('/api/images');
      setImages(response.data);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('/api/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchImages();
      setFile(null);
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/images', { data: { id } });
      fetchImages();
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  return (
    <div>
      <h1>Image Management</h1>

      <form onSubmit={handleUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Upload Image</button>
      </form>

      <ul>
        {images.map((image) => (
          <li key={image.id}>
            {image.name} - <img src={image.filePath} alt={image.name} width="100" />
            <button onClick={() => handleDelete(image.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}