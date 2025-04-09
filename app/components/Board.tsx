import { Key, useEffect, useState } from "react";
import Feedbackitem from "@/app/components/Feedbackitem";
import FeedbackFormPopup from "@/app/components/FeedbackFormPopup";
import Button from "@/app/components/Button";
import FeedbackItemPopup from "@/app/components/FeedbackItemPopup";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Feedback {
  _id: Key | null | undefined;
  id: string;
  title: string;
  description?: string;
  votesCount: number;
}

export default function Board() {
  const [showFeedbackPopupForm, setShowFeedbackPopupForm] = useState(false);
  const [showFeedbackPopupItem, setShowFeedbackPopupItem] =
    useState<Feedback | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    axios
      .get("/api/feedback")
      .then((res) => {
        setFeedbacks(res.data);
      })
      .catch((error) => {
        console.error("Error fetching feedbacks:", error);
      });
  }, []);

  useEffect(()=>{
    if(session?.user?.email){
      const feedbackId=localStorage.getItem('vote_after_login');
        if(feedbackId){
          alert(feedbackId);
        }
    }
  },[session?.user?.email]);

  function openFeedbackPopupForm() {
    setShowFeedbackPopupForm(true);
  }

  function openFeedbackPopupItem(feedback: Feedback) {
    setShowFeedbackPopupItem(feedback);
  }

  return (
    <main className="bg-white max-w-4xl mx-auto shadow-lg rounded-lg mt-8 overflow-hidden">

      {session?.user ? (
        <div>{session.user.email}</div>
      ) : (
        <div>not logged in</div>
      )}

      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
        <h1 className="font-bold text-xl">Feedboard</h1>
        <p>
          A portal where you can submit feedbacks and ideas for the products.
        </p>
      </div>

      <div className="bg-gray-100 px-8 py-4 flex border-b">
        <div className="grow">Filters</div>
        <div>
          <Button primary={true} disabled={false} onClick={openFeedbackPopupForm}>
            Make a suggestion
          </Button>
        </div>
      </div>

      <div className="px-8">
        {feedbacks.map((feedback) => (
          <Feedbackitem
            key={feedback._id}
            onOpen={() => openFeedbackPopupItem(feedback)}
            title={feedback.title}
            description={feedback.description || "No description available"}
            votesCount={feedback.votesCount}
            _id={undefined}
          />
        ))}
      </div>

      {showFeedbackPopupForm && <FeedbackFormPopup setShow={setShowFeedbackPopupForm} />}

      {showFeedbackPopupItem && (
        <FeedbackItemPopup
          key={showFeedbackPopupItem.id}
          {...showFeedbackPopupItem}
          setShow={setShowFeedbackPopupItem}
          description={showFeedbackPopupItem.description || "No description available"}
        />
      )}
    </main>
  );
}
