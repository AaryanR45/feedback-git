import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import CommentForm from "@/app/components/CommentForm";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function FeedbackItemPopupComments({ feedbackId }) {
  const [comments, setComments] = useState([]);
  const { data: session } = useSession();
  const [editingComment, setEditingComment] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');


  useEffect(() => {
    fetchComments();
  }, []);
  function fetchComments() {
    axios.get("/api/comment?feedbackId=" + feedbackId).then((res) => {
      setComments(res.data);
    });
  }

  function handleEditButtonClick(comment) {
    setEditingComment(comment);
    setNewCommentText(comment.text);
  }
  function handleCancelButtonClick(){
    setNewCommentText('');
    setEditingComment(null);
  }
  async function handleSaveChangesButtonClick(){
    const newData={text: newCommentText};
    await axios.put('/api/comment',{id:editingComment._id,...newData});
    setComments(existingComments=>{
      return existingComments.map(comment=>{
        if(comment._id===editingComment._id){
          return{...comment,...newData};
        }else{
          return comment;
        }
      });
    })
    setEditingComment(null);
  }

  return (
    <div className="p-8">
      {comments?.length > 0 &&
        comments.map((comment) => (
          <div key={comment._id} className="flex gap-4 mb-8">
            <Avatar url={comment.user.image} />
            <div>
              {editingComment?._id === comment?._id && (
                <textarea 
                value={newCommentText}
                onChange={ev=>setNewCommentText(ev.target.value)}
                className="border p-2 block w-full" />
              )}
              {editingComment?._id !== comment._id && (
                <p className="text-gray-600">{comment.text}</p>
              )}

              <div className="text-gray-400 mt-2 text-sm">
                {comment.user?.name || "Anonymous"}
                {editingComment?._id !== comment._id &&
                  !!comment.user.email &&
                  comment.user.email === session?.user?.email && (
                    <>
                      &nbsp;&middot;&nbsp;
                      <span
                        onClick={() => handleEditButtonClick(comment)}
                        className="cursor-pointer hover:underline"
                      >
                        Edit
                      </span>
                    </>
                  )}
                {editingComment?._id === comment._id && (
                  <>
                    &nbsp;&middot;&nbsp;
                    <span 
                    onClick={handleCancelButtonClick}
                    className="cursor-pointer hover:underline">
                      Cancel
                    </span>
                    &nbsp;&middot;&nbsp;
                    <span
                    onClick={handleSaveChangesButtonClick} 
                    className="cursor-pointer hover:underline">
                      Save Changes
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {!editingComment && (
          <CommentForm feedbackId={feedbackId} onPost={fetchComments} />
        )}
    </div>
  );
}
