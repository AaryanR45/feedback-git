import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import CommentForm from"@/app/components/CommentForm";
import axios from "axios";

export default function FeedbackItemPopupComments({feedbackId}) {
    const[comments,setComments]=useState([]);
 useEffect(()=>{
    fetchComments();
 },[]);
function fetchComments(){
    axios.get('/api/comment?feedbackId='+feedbackId).then(res=>{
        setComments(res.data);
    });
}

  return (
    <div className="p-8">
        {comments?.length>0 && comments.map(comment=>(
             <div key={comment._id} className="flex gap-4 mb-8">
             <Avatar url={comment.user.image}/>
             <div>
               <p className="text-gray-600">{comment.text}</p>
               <div className="text-gray-400 mt-2 text-sm">
                {comment.user?.name || "Anonymous"}
                
               </div>
             </div>

           </div>
        ))}
      <CommentForm feedbackId={feedbackId} onPost={fetchComments}/>
    </div>
  );
}
