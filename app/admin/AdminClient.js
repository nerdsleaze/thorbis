'use client';

import { useState, useEffect } from 'react';

export default function AdminClient() {
  const [blueprints, setBlueprints] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlueprints();
  }, []);

  const fetchBlueprints = async () => {
    try {
      console.log('Fetching blueprints...');
      const response = await fetch('/api/blueprints');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched blueprints:', data);
      setBlueprints(data.blueprints);
    } catch (e) {
      console.error("Failed to fetch blueprints:", e);
      setError(e.message);
    }
  };

  const activateBlueprint = async (id) => {
    try {
      const response = await fetch('/api/blueprints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchBlueprints(); // Refresh the list after activation
    } catch (e) {
      console.error("Failed to activate blueprint:", e);
      setError(e.message);
    }
  };

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Admin Panel</h1>
      <h2 className="mb-2 text-xl font-semibold">Blueprints</h2>
      {blueprints.length === 0 ? (
        <p>No blueprints found.</p>
      ) : (
        <ul className="mb-4">
          {blueprints.map((blueprint) => (
            <li key={blueprint.id} className="mb-2">
              <span>{blueprint.name}</span>
              <button 
                onClick={() => activateBlueprint(blueprint.id)}
                className={`ml-2 px-2 py-1 rounded ${blueprint.isActive ? 'bg-green-500' : 'bg-blue-500'} text-white`}
              >
                {blueprint.isActive ? 'Active' : 'Activate'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}