import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  email: String,
  eventLink: String,
  timestamp: { type: Date, default: Date.now },
});
export const Email = mongoose.model("Email", emailSchema);
