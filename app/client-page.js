'use client';

import { useEffect, useState } from 'react';

export default function ClientPage() {
  const [activeBlueprint, setActiveBlueprint] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchActiveBlueprint() {
      try {
        const response = await fetch('/api/blueprints/active');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setActiveBlueprint(data.blueprint);
      } catch (e) {
        console.error("Failed to fetch active blueprint:", e);
        setError(e.message);
      }
    }
    fetchActiveBlueprint();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <h1>Welcome to Thorbis CMS</h1>
      {activeBlueprint ? (
        <div>
          <h2>Active Blueprint: {activeBlueprint.name}</h2>
          <pre>{JSON.stringify(JSON.parse(activeBlueprint.config), null, 2)}</pre>
        </div>
      ) : (
        <p>No active blueprint found.</p>
      )}
    </main>
  );
}