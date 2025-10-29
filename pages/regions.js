import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Regions() {
  const [regions, setRegions] = useState([]);
  const [formData, setFormData] = useState({ name: '', isActive: true });

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      const response = await axios.get('/api/regions');
      setRegions(response.data);
    } catch (error) {
      console.error('Failed to fetch regions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/regions', formData);
      fetchRegions();
      setFormData({ name: '', isActive: true });
    } catch (error) {
      console.error('Failed to create region:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/regions', { data: { id } });
      fetchRegions();
    } catch (error) {
      console.error('Failed to delete region:', error);
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await axios.put('/api/regions', { id, isActive });
      fetchRegions();
    } catch (error) {
      console.error('Failed to update region:', error);
    }
  };

  return (
    <div>
      <h1>Regions Management</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Region Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <button type="submit">Add Region</button>
      </form>

      <ul>
        {regions.map((region) => (
          <li key={region.id}>
            {region.name} - {region.isActive ? 'Active' : 'Inactive'}
            <button onClick={() => handleToggleActive(region.id, !region.isActive)}>
              {region.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button onClick={() => handleDelete(region.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}