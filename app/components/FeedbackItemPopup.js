import Popup from "./Popup";
import Button from "./Button";
import FeedbackItemPopupComments from "./FeedbackItemPopupComment";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Tick from "./icons/Tick";

export default function FeedbackItemPopup({
  _id,
  title,
  setShow,
  description,
  votes,
  onVotesChange,
  image,
}) {
  const { data: session } = useSession();
  function handleVoteButtonClick() {
    axios.post("api/vote", { feedbackId: _id }).then(async () => {
      await onVotesChange();
    });
  }
  const iVoted = !!votes.find((v) => v.userEmail === session?.user?.email);
  return (
    <Popup title={""} setShow={setShow}>
      <div className="p-8">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
        {image?.trim() && (
          <div className="mt-4">
            <div className="mb-2 font-medium">Image:</div>
            <img
              src={image}
              alt="Feedback"
              className="rounded-md max-w-xs border"
            />
          </div>
        )}
      </div>
      <div className="flex justify-end px-8 py-2 border-b">
        <Button
          primary
          onClick={handleVoteButtonClick}
          className="shadow-sm border"
        >
          {iVoted && (
            <>
              <Tick className="w-4 h-4" />
              Upvoted {votes?.length || "0"}
            </>
          )}
          {!iVoted && (
            <>
              <span className="triangle-up"></span>
              Upvote {votes?.length || "0"}
            </>
          )}
        </Button>
      </div>
      <div>
        <FeedbackItemPopupComments />
      </div>
    </Popup>
  );
}
