import mongoose from "mongoose";
import { UserDetails } from "../../config/db.js";



const UserSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, sparse: true }, // Make sure sparse is added to allow non-Google users
    name: { type: String, required: true },
    email: { type: String, required: true },
    email_verified: { type: Boolean, default: false },
    picture: { type: String },
    given_name: { type: String },
    accessToken: { type: String },
  },
  { timestamps: true } // ✅ Adds createdAt & updatedAt fields
);

const login = UserDetails.model("Users", UserSchema);

export default login;