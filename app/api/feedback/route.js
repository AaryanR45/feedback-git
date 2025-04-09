import mongoose from "mongoose";
import Feedback from "../../models/Feedback";

const mongoUrl = process.env.MONGO_URL;

async function connectToDatabase() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(mongoUrl, {
      connectTimeoutMS: 30000,
    });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();

    const { title, description, image } = await request.json();
    const feedback = await Feedback.create({ title, description, image });

    return new Response(JSON.stringify(feedback), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error saving feedback:", err);
    return new Response("Error saving feedback", { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    const feedbacks = await Feedback.find();
    return new Response(JSON.stringify(feedbacks), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching feedbacks:", err);
    return new Response("Error fetching feedbacks", { status: 500 });
  }
}
