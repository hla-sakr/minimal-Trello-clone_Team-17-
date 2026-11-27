import mongoose from "mongoose";

const { Schema } = mongoose;

const cardSchema = new Schema(
  {
    board: { type: Schema.Types.ObjectId, ref: "Board", required: true, index: true },

    list: { type: Schema.Types.ObjectId, ref: "List", required: true, index: true },

    title: { type: String, required: true, trim: true },

    description: { type: String, default: "" },

    position: { type: Number, required: true },

    members: [{ type: Schema.Types.ObjectId, ref: "User" }],

    labels: [{ type: Schema.Types.ObjectId }],

    dueDate: { type: Date, default: null },

    dueComplete: { type: Boolean, default: false },
  },
  { timestamps: true }//tells Mongoose to automatically manage two fields
// createdAt	When the card was created
// updatedAt	When the card was last updated
);

// Enable text search by card title and description
cardSchema.index({ title: "text", description: "text" });

// Create and export the Card model
// model called Card, based on our schema
// By default, Mongoose associates it with the cards collection
export default mongoose.model("Card", cardSchema);
