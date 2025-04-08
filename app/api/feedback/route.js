import mongoose from "mongoose";
import { Feedback } from "../../models/Feedback";

export async function POST(request) {
  const { title, description } = await request.json();
  const mongoUrl = process.env.MONGO_URL;
  try{
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUrl);
    }
    const feedback = await Feedback.create({ title, description });
    return new Response(JSON.stringify(feedback),{
      status:200,
      headers:{"Content-Type":"application/json"},
    });
  } catch (err) {
    console.error("Error saving feedback:", err);
    return new Response("Error saving feedback", { status: 500 });
  }
}
