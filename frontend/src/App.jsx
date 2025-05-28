import { useState } from 'react'

import './App.css'
import { useEffect } from 'react';
import EventCard from './components/EventCard';

 function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch(`https://louder-project.onrender.com/api/events`);
      const data = await res.json();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Sydney Events</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, i) => (
          <EventCard key={i} event={event} />
        ))}
      </div>
    </main>
  );
}


export default App
