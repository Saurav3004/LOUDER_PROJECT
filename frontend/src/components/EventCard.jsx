// src/components/EventCard.jsx
import React, { useState } from "react";

export default function EventCard({ event }) {
  const [email, setEmail] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleSubmit = async () => {
    if (!email) return alert("Please enter your email.");

    try {
      const res = await fetch(`${https://louder-project.onrender.com}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, eventLink: event.link }),
      });

      const data = await res.json();
      if (data.message) {
        window.location.href = event.link;
      } else {
        alert("Subscription failed. Try again.");
      }
    } catch (err) {
      alert("Something went wrong.",err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col">
      <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
      <p className="text-gray-600">{event.date}</p>
      <p className="text-gray-600 mb-4">{event.location}</p>

      {showInput ? (
        <div className="mt-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-2 border rounded w-full mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full cursor-pointer"
          >
            Continue to Tickets
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="mt-auto bg-black text-white px-4 py-2 rounded cursor-pointer"
        >
          Get Tickets
        </button>
      )}
    </div>
  );
}
