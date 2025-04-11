import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Vote } from "../../models/Vote";

export async function GET(request){
    const url=new URL(request.url);
    if(url.searchParams.get('feedbackIds')){
        const feedbackIds=url.searchParams.get('feedbackIds').split(',');
    const votesDocs=  await  Vote.find({feedbackId:feedbackIds});
    return Response.json(votesDocs);
    }
    return Response.json([]);
}
export async function POST(request) {
    await mongoose.connect(process.env.MONGO_URL);
    const jsonBody = await request.json();
    let { feedbackId } = jsonBody;

    feedbackId = new mongoose.Types.ObjectId(feedbackId); 

    const session = await getServerSession(authOptions);const { email: userEmail } = session.user;

    const existingVote=await Vote.findOne({feedbackId,userEmail});
    if(existingVote){
        await Vote.findByIdAndDelete(existingVote._id);
        return Response.json(existingVote);
    }else{
        const voteDoc = await Vote.create({ feedbackId, userEmail });
        return Response.json(voteDoc);
    }  
}