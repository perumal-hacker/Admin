const resetpassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("❌ Server Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = resetpassword;