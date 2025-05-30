import React, { useState } from "react";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

export default function EventCard({ event }) {
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("input"); // "input" | "otp"

  const handleSendOtp = async () => {
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      alert(validation.error.errors[0].message);
      return;
    }

    if (!dob) {
      alert("Please enter your date of birth.");
      return;
    }

    try {
      // First subscribe
      const subRes = await fetch(`https://louder-project.onrender.com/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, event: event.link }),
      });
      const subData = await subRes.json();

      if (!subData.message) throw new Error("Subscription failed");

      // Then send OTP
      const otpRes = await fetch(`https://louder-project.onrender.com/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const otpData = await otpRes.json();
      if (otpData.message) {
        alert("OTP sent to your email.");
        setStep("otp");
      } else {
        alert("Failed to send OTP.");
      }
    } catch (err) {
      alert("Something went wrong.",err);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP.");
      return;
    }

    try {
      const verifyRes = await fetch(`https://louder-project.onrender.com/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const verifyData = await verifyRes.json();
      console.log(verifyData)
      if (verifyData.success) {
        window.location.href = event.link;
      } else {
        alert("Invalid OTP.");
      }
    } catch (err) {
      alert("Verification failed.",err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col">
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover rounded-t-2xl mb-4"
        />
      )}
      <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
      <p className="text-gray-600">{event.date}</p>
      <p className="text-gray-600 mb-4">{event.location}</p>

      {step === "input" ? (
        <div className="space-y-2 mt-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-2 border rounded w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="date"
            placeholder="Enter your date of birth"
            className="p-2 border rounded w-full"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <button
            onClick={handleSendOtp}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Send OTP
          </button>
        </div>
      ) : (
        <div className="space-y-2 mt-2">
          <input
            type="text"
            placeholder="Enter OTP"
            className="p-2 border rounded w-full"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={handleVerifyOtp}
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            Verify OTP & Get Tickets
          </button>
        </div>
      )}
    </div>
  );
}
