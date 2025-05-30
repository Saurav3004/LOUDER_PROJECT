import nodemailer from "nodemailer";
import dotenv from 'dotenv'
dotenv.config()
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port:587,
  secure:false,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});



export async function sendEmailOtp(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to:email,
    subject: "Your OTP for Event Access",
    text: `Your OTP is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
}
