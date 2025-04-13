import { Key, useEffect, useState } from "react";
import Feedbackitem from "@/app/components/Feedbackitem";
import FeedbackFormPopup from "@/app/components/FeedbackFormPopup";
import Button from "@/app/components/Button";
import FeedbackItemPopup from "@/app/components/FeedbackItemPopup";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Feedback {
  _id: string;
  id: string;
  title: string;
  description: string;
  image: string;
}
interface Vote {
  feedbackId: string;
  votes: number;
}

export default function Board() {
  const [showFeedbackPopupForm, setShowFeedbackPopupForm] = useState(false);
  const [showFeedbackPopupItem, setShowFeedbackPopupItem] =
    useState<Feedback | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
  fetchFeedbacks();
  }, []);

  useEffect(() => {
    fetchVotes();
  }, [feedbacks]);

  useEffect(() => {
    const feedbackId = localStorage.getItem("vote_after_login");

    if (session?.user?.email && feedbackId) {
      axios.post("/api/vote", { feedbackId }).then(() => {
        localStorage.removeItem("vote_after_login");
        fetchVotes();
      });
    }
  }, [session?.user?.email]);

  async function fetchFeedbacks(){
    axios
    .get("/api/feedback")
    .then((res) => {
      setFeedbacks(res.data);
    })
    .catch((error) => {
      console.error("Error fetching feedbacks:", error);
    });
  }

  function fetchVotes() {
    const ids = feedbacks.map((f) => f._id);
    axios.get("/api/vote?feedbackIds=" + ids.join(",")).then((res) => {
      setVotes(res.data);
    });
  }
  function openFeedbackPopupForm() {
    setShowFeedbackPopupForm(true);
  }

  function openFeedbackPopupItem(feedback: Feedback) {
    setShowFeedbackPopupItem(feedback);
  }
  return (
    <main className="bg-white max-w-4xl mx-auto shadow-lg rounded-lg mt-8 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-8">
        <h1 className="font-bold text-xl">Feedboard</h1>
        <p>
          A portal where you can submit feedbacks and ideas for the products.
        </p>
      </div>

      <div className="bg-gray-100 px-8 py-4 flex border-b">
        <div className="grow">Filters</div>
        <div>
          <Button
            primary
            disabled={false}
            onClick={openFeedbackPopupForm}
            className={undefined}
          >
            Make a suggestion
          </Button>
        </div>
      </div>

      <div className="px-8">
        {feedbacks.map((feedback) => (
          <Feedbackitem
            key={feedback._id}
            _id={feedback._id}
            votes={votes.filter(
              (v) => v.feedbackId.toString() === feedback._id.toString()
            )}
            onOpen={() => openFeedbackPopupItem(feedback)}
            title={feedback.title}
            description={feedback.description || "No description available"}
            feedbackId={feedback._id}
            onVotesChange={fetchVotes}
          />
        ))}
      </div>

      {showFeedbackPopupForm && (
        <FeedbackFormPopup onCreate={fetchFeedbacks} setShow={setShowFeedbackPopupForm} />
      )}

      {showFeedbackPopupItem && (
        <FeedbackItemPopup
          key={showFeedbackPopupItem.id}
          {...showFeedbackPopupItem}
          votes={votes.filter(
            (v) => v.feedbackId.toString() === showFeedbackPopupItem._id
          )}
          setShow={setShowFeedbackPopupItem}
          onVotesChange={fetchVotes}
          description={
            showFeedbackPopupItem.description || "No description available"
          }
          image={showFeedbackPopupItem.image}
        />
      )}
    </main>
  );
}
