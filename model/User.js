import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  _id: {
    type: String, // Clerk ka user id string hota hai
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
