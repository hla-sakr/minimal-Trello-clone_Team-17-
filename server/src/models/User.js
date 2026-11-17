/*Define the structure of a User document in MongoDB*/
import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    avatar: { type: String, default: "" },
  },
  { timestamps: true } //Mongo adds createdAt and updatedAt automatically
);

//creates a Mongoose model called "User" using the schema we defined
export default mongoose.model("User", userSchema);