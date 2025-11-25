import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    armyId: { type: String, required: true },
    militaryEmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
