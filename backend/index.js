import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cron from "node-cron";
import { scrapeSydneyEvents } from "./scraper/scrapeSydneyEvents.js";
import { Event } from "./models/event.js";
import { Email } from "./models/email.js";
import dotenv from "dotenv";
import generateOtp from "./utils/generateOtp.js";
import { sendEmailOtp } from "./utils/sendEmailotp.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI);
const otpStore = new Map()

mongoose.connection.once("open", async () => {
  console.log("MongoDB connected");

  try {
    const events = await scrapeSydneyEvents();
    await Event.deleteMany({});
    await Event.insertMany(events);
    console.log("Initial events scraped and saved");
  } catch (err) {
    console.error("Initial scraping failed:", err);
  }
});

app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

app.post("/subscribe", async (req, res) => {
  const { email, eventLink } = req.body;
  if (!email || !eventLink) {
    return res
      .status(400)
      .json({ message: "Email and eventLink are required" });
  }

  try {
    await Email.create({ email, eventLink });
    res.json({ message: "Email subscribed successfully" });
  } catch (err) {
    console.error("Error saving subscription:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = generateOtp();
  otpStore.set(email, otp);

  try {
    await sendEmailOtp(email, otp);
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Failed to send OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Verify OTP
app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const validOtp = otpStore.get(email);
  if (validOtp === otp) {
    otpStore.delete(email);
    res.json({ success:true,message: "OTP verified" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

cron.schedule("0 */6 * * *", async () => {
  console.log("Scraping Sydney events...");
  try {
    const events = await scrapeSydneyEvents();
    await Event.deleteMany({});
    await Event.insertMany(events);
    console.log("Events updated");
  } catch (error) {
    console.error("Cron job failed:", error);
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("server is running ");
});
