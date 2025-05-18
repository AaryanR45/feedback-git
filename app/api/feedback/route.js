import mongoose from "mongoose";
import { Feedback } from "../../models/Feedback";
import { Comment } from "../../models/Comment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const mongoUrl = process.env.MONGO_URL;

async function connectToDatabase() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(mongoUrl, {
      connectTimeoutMS: 30000,
    });
  }
}

export async function POST(request) {
  await connectToDatabase();

  const { title, description, image } = await request.json();
  const session = await getServerSession(authOptions);
  const userEmail = session.user.email;
  const feedbackDoc = await Feedback.create({
    title,
    description,
    image,
    userEmail,
  });

  return Response.json(feedbackDoc);
}

export async function PUT(request) {
  await connectToDatabase();

  const { title, description, image, _id } = await request.json();
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(false);
  }
  const newFeedbackDoc = await Feedback.updateOne(
    { _id, userEmail: session.user.email },
    { title, description, image }
  );
  return Response.json(newFeedbackDoc);
}

export async function GET(req) {
  const url = new URL(req.url);
  await connectToDatabase();
  if (url.searchParams.get("id")) {
    return Response.json(await Feedback.findById(url.searchParams.get("id")));
  } else {
    const sortParam = url.searchParams.get("sort")||'votes';
    const loadedRows = url.searchParams.get("loadedRows");
    const searchPhrase = url.searchParams.get("search");
    let sortDef;
    if (sortParam === "latest") {
      sortDef = { createdAt: -1 };
    } else if (sortParam === "oldest") {
      sortDef = { createdAt: 1 };
    } else {
      sortDef = { votesCountCached: -1 };
    }
    let filter = null;
    if (searchPhrase) {
      const commentsIds = await Comment.find(
        {
          text: { $regex: ".*" + searchPhrase + ".*" },
        },
        "feedbackId",
        { limit: 20 }
      );
      filter = {
        $or: [
          { title: { $regex: ".*" + searchPhrase + ".*" } },
          { description: { $regex: ".*" + searchPhrase + ".*" } },
          { _id: commentsIds.map((c) => c.feedbackId) },
        ],
      };
    }

    return Response.json(
      await Feedback.find(filter, null, {
        sort: sortDef,
        skip: loadedRows,
        limit: 10,
      }).populate("user")
    );
  }
}
