import { useState, useEffect } from 'react';
import axios from 'axios';

export default function BasePrices() {
  const [basePrices, setBasePrices] = useState([]);

  useEffect(() => {
    fetchBasePrices();
  }, []);

  const fetchBasePrices = async () => {
    try {
      const response = await axios.get('/api/baseprices');
      setBasePrices(response.data);
    } catch (error) {
      console.error('Failed to fetch base prices:', error);
    }
  };

  const handleUpdate = async (id, basePrice) => {
    try {
      await axios.put('/api/baseprices', { id, basePrice });
      fetchBasePrices();
    } catch (error) {
      console.error('Failed to update base price:', error);
    }
  };

  return (
    <div>
      <h1>Base Price Management</h1>

      <ul>
        {basePrices.map((entity) => (
          <li key={entity.id}>
            {entity.name} - ${entity.basePrice}
            <input
              type="number"
              placeholder="New Base Price"
              onChange={(e) => handleUpdate(entity.id, e.target.value)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}