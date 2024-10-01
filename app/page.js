'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [activeBlueprint, setActiveBlueprint] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchActiveBlueprint() {
      try {
        const response = await fetch('/api/active-blueprint');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.activeBlueprint) {
          setActiveBlueprint(JSON.parse(data.activeBlueprint.config));
        } else {
          setError('No active blueprint found');
        }
      } catch (error) {
        console.error('Error fetching active blueprint:', error);
        setError('Failed to fetch active blueprint');
      }
    }

    fetchActiveBlueprint();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!activeBlueprint) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Active Blueprint: {activeBlueprint.name}</h1>
      <h2>Layouts:</h2>
      <ul>
        {activeBlueprint.layouts.map((layout, index) => (
          <li key={index}>{layout}</li>
        ))}
      </ul>
      <h2>Components:</h2>
      <ul>
        {activeBlueprint.components.map((component, index) => (
          <li key={index}>{component}</li>
        ))}
      </ul>
    </div>
  );
}