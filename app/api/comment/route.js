import {Comment} from "../../models/Comment";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { User } from "../../models/User";

export async function POST(req){
   await mongoose.connect(process.env.MONGO_URL);
    const jsonBody=await req.json();
    const session=await getServerSession(authOptions);
    const commentDoc=await Comment.create({
        text:jsonBody.text,
        userEmail:session.user.email,
        feedbackId:jsonBody.feedbackId,
    });
    return Response.json(commentDoc);
}

export async function GET(req){
    await mongoose.connect(process.env.MONGO_URL);
    const url=new URL(req.url);
    if(url.searchParams.get('feedbackId')){
        const result= await Comment.find({feedbackId:url.searchParams.get('feedbackId')})
        .populate('user');
        return Response.json(
           result.map(doc=>{
            const{userEmail,...commentWithoutEmail}=doc.toJSON();
            const{email,...userWithoutEmail}=commentWithoutEmail.user;
            commentWithoutEmail.user=userWithoutEmail;
            return commentWithoutEmail;
           })
        );
    }
    return Response.json(false);
}