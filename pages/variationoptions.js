import { useState, useEffect } from 'react';
import axios from 'axios';

export default function VariationOptions() {
  const [variationOptions, setVariationOptions] = useState([]);
  const [formData, setFormData] = useState({ name: '', floorPlanId: '', isActive: true });

  useEffect(() => {
    fetchVariationOptions();
  }, []);

  const fetchVariationOptions = async () => {
    try {
      const response = await axios.get('/api/variationoptions');
      setVariationOptions(response.data);
    } catch (error) {
      console.error('Failed to fetch variation options:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/variationoptions', formData);
      fetchVariationOptions();
      setFormData({ name: '', floorPlanId: '', isActive: true });
    } catch (error) {
      console.error('Failed to create variation option:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/variationoptions', { data: { id } });
      fetchVariationOptions();
    } catch (error) {
      console.error('Failed to delete variation option:', error);
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await axios.put('/api/variationoptions', { id, isActive });
      fetchVariationOptions();
    } catch (error) {
      console.error('Failed to update variation option:', error);
    }
  };

  return (
    <div>
      <h1>Variation Options Management</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Variation Option Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Floor Plan ID"
          value={formData.floorPlanId}
          onChange={(e) => setFormData({ ...formData, floorPlanId: e.target.value })}
        />
        <button type="submit">Add Variation Option</button>
      </form>

      <ul>
        {variationOptions.map((option) => (
          <li key={option.id}>
            {option.name} - {option.isActive ? 'Active' : 'Inactive'}
            <button onClick={() => handleToggleActive(option.id, !option.isActive)}>
              {option.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button onClick={() => handleDelete(option.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}