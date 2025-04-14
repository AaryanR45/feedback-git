import Button from "@/app/components/Button";
import { useState } from "react";
import axios from "axios";

export default function CommentForm({feedbackId,onPost}) {
    const [commentText, setCommentText] = useState("");
    async function handleCommentButtonClick(ev){
        ev.preventDefault();
        await axios.post('/api/comment',{
            text:commentText,
            feedbackId,
        });
        setCommentText('');
        onPost();
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
          Comment
        </Button>
      </div>
    </form>
  );
}
