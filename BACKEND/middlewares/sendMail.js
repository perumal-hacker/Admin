// utils/sendLoginMail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendLoginMail = async (userEmail, userName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"InstaShipin" <${process.env.MAIL_USER}>`,
      to: userEmail,
      subject: "Login Successful - Topo",
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Hello ${userName || "User"},</h2>
          <p>Vanakam da Maapla</p>
          <p>Vanthu irukra edam sooperu</p>
          <br />
          <p>Thank you</p>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log("Login email sent to:", userEmail);
  } catch (err) {
    console.error("Error sending login email:", err.message);
  }
};

export default sendLoginMail;