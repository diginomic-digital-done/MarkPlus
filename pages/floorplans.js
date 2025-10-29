import { useState, useEffect } from 'react';
import axios from 'axios';

export default function FloorPlans() {
  const [floorPlans, setFloorPlans] = useState([]);
  const [formData, setFormData] = useState({ name: '', regionId: '', isActive: true });

  useEffect(() => {
    fetchFloorPlans();
  }, []);

  const fetchFloorPlans = async () => {
    try {
      const response = await axios.get('/api/floorplans');
      setFloorPlans(response.data);
    } catch (error) {
      console.error('Failed to fetch floor plans:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/floorplans', formData);
      fetchFloorPlans();
      setFormData({ name: '', regionId: '', isActive: true });
    } catch (error) {
      console.error('Failed to create floor plan:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/floorplans', { data: { id } });
      fetchFloorPlans();
    } catch (error) {
      console.error('Failed to delete floor plan:', error);
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await axios.put('/api/floorplans', { id, isActive });
      fetchFloorPlans();
    } catch (error) {
      console.error('Failed to update floor plan:', error);
    }
  };

  return (
    <div>
      <h1>Floor Plans Management</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Floor Plan Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Region ID"
          value={formData.regionId}
          onChange={(e) => setFormData({ ...formData, regionId: e.target.value })}
        />
        <button type="submit">Add Floor Plan</button>
      </form>

      <ul>
        {floorPlans.map((floorPlan) => (
          <li key={floorPlan.id}>
            {floorPlan.name} - {floorPlan.isActive ? 'Active' : 'Inactive'}
            <button onClick={() => handleToggleActive(floorPlan.id, !floorPlan.isActive)}>
              {floorPlan.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button onClick={() => handleDelete(floorPlan.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}