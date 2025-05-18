import Button from "@/app/components/Button";
import { useState } from "react";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";

export default function CommentForm({feedbackId,onPost}) {
    const [commentText, setCommentText] = useState("");
    const {data:session}=useSession();

    async function handleCommentButtonClick(ev){
        ev.preventDefault();
        const commentData={
          text:commentText,
          feedbackId,
        };
        if(session){
          await axios.post('/api/comment',commentData);
          setCommentText('');
          onPost();
        }else{
          localStorage.setItem('comment_after_login',JSON.stringify(commentData));
          await signIn('google');
        }  
    }
  return (
    <form>
      <textarea
        className="border rounded-md w-full p-2"
        placeholder="Add Comments"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      ></textarea>
      <div className="flex justify-end gap-2 mt-2">
        <Button onClick={handleCommentButtonClick} primary disabled={commentText === ""}>
          {session ? 'Comment' : 'Login and comment'}
        </Button>
      </div>
    </form>
  );
}
