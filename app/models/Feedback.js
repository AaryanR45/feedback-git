import { model, models, Schema } from "mongoose";

const feedbackSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

const Feedback = models.Feedback || model("Feedback", feedbackSchema);

export default Feedback;
