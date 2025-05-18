import { Comment } from "../../models/Comment";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "../../models/User";

export async function POST(req) {
  await mongoose.connect(process.env.MONGO_URL);
  const jsonBody = await req.json();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(false);
  }
  const commentDoc = await Comment.create({
    text: jsonBody.text,
    userEmail: session.user.email,
    feedbackId: jsonBody.feedbackId,
  });
  return Response.json(commentDoc);
}

export async function PUT(req) {
  await mongoose.connect(process.env.MONGO_URL);
  const jsonBody = await req.json();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(false);
  }
  const{id, text}=jsonBody;
  const updatedCommentDoc=await Comment.findOneAndUpdate(
    {userEmail:session.user.email,_id:id},
    {text},
  );
  return Response.json(updatedCommentDoc);
}

export async function GET(req) {
  await mongoose.connect(process.env.MONGO_URL);
  const url = new URL(req.url);
  if (url.searchParams.get("feedbackId")) {
    const result = await Comment.find({
      feedbackId: url.searchParams.get("feedbackId"),
    }).populate("user");
    return Response.json(result);
  }
  return Response.json(false);
}
