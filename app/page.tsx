"use client";
import { useState } from "react";
import Feedbackitem from "@/app/components/Feedbackitem";
import FeedbackFormPopup from "@/app/components/FeedbackFormPopup";
import Button from "@/app/components/Button";
import FeedbackItemPopup from "@/app/components/FeedbackItemPopup";

export default function Home() {
  const [showFeedbackPopupForm, setShowFeedbackPopupForm] = useState(false);
  const [showFeedbackPopupItem, setShowFeedbackPopupItem] = useState<
    typeof feedbacks | null
  >(null);
  function openFeedbackPopupForm() {
    setShowFeedbackPopupForm(true);
  }
  function openFeedbackPopupItem(feedback: any) {
    setShowFeedbackPopupItem(feedback);
  }
  const feedbacks = [
    {
      id: 1,
      title: "Is AI really the future?",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed, rem fugit. Non mollitia tenetur praesentium amet delectus quisquam eaque molestiae minima.",
      votesCount: 80,
    },
    {
      id: 2,
      title: "Is AI really the future? 2",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed, rem fugit. Non mollitia tenetur praesentium amet delectus quisquam eaque molestiae minima.",
      votesCount: 60,
    },
  ];
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
          <Button primary={true} disabled={false} onClick={openFeedbackPopupForm}>
            Make a suggestion
          </Button>
        </div>
      </div>

      <div className="px-8">
        {feedbacks.map((feedback) => (
          <Feedbackitem
            key={feedback.id}
            {...feedback}
            onOpen={() => openFeedbackPopupItem(feedback)}
          />
        ))}
      </div>
      {showFeedbackPopupForm && (
        <FeedbackFormPopup setShow={setShowFeedbackPopupForm} />
      )}
      {showFeedbackPopupItem &&
        typeof showFeedbackPopupItem === "object" &&
        "title" in showFeedbackPopupItem && (
          <FeedbackItemPopup description={undefined} votesCount={undefined} setShow={setShowFeedbackPopupItem} {...showFeedbackPopupItem} />
        )}
    </main>
  );
}
