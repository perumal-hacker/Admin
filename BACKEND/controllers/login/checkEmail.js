import login from "../../models/User/login.model.js";

const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await login.findOne({ email });

    if (user) {
      return res.status(200).json({ exists: true, message: "User exists" });
    } else {
      return res.status(200).json({ exists: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Email check error:", error.message);
    res.status(500).json({ message: "Server error"});
  }
};

export default checkEmail;