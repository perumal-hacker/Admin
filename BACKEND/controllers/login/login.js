import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import login from "../../models/User/login.model.js";
import dotenv from "dotenv";
import sendLoginMail from "../../middlewares/sendMail.js";
              
dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  
const googleLoginController = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Google token missing" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, 
    });

    const payload = ticket.getPayload();
    const { sub, name, email, email_verified, picture, given_name } = payload;

    let user = await login.findOne({email});
    let isNewUser = false;

    if (!user) {
      user = new login({
        googleId: sub,
        name, 
        email,
        email_verified,
        picture,
        given_name,
      });

      await user.save();
      isNewUser = true;
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // ✅ Always send login email
    await sendLoginMail(user.email, user.name || given_name);

    return res.status(200).json({
      message: isNewUser ? "Signup successful" : "Login successful",
      token: jwtToken,
      user,
    });

  }catch (error) {
    console.error("Google OAuth Error:", error.message || error);
    return res.status(500).json({
      message: "OAuth authentication failed",
      error: error.message || "Unknown error",
    });
  }
}
  export default  googleLoginController;