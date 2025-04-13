"use client";
import { useState } from "react";
import Popup from "./Popup";
import Button from "./Button";
import { signIn, useSession } from "next-auth/react";
import axios from "axios";

export default function Feedbackitem({
  onOpen,
  _id,
  title,
  description,
  votes,
  feedbackId,
  onVotesChange,
}) {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { data: session } = useSession();

  async function handleVoteButtonClick(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    if (!session?.user) {
      localStorage.setItem("vote_after_login", _id);
      setShowLoginPopup(true);
    } else {
      try {
        axios.post("/api/vote", { feedbackId: _id }).then(() => {
          onVotesChange();
        });
      } catch (err) {
        alert("Vote failed:", err);
      }
    }
  }

  async function handleGoogleLoginButtonClick(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    await signIn("google");
  }

  const iVoted = !!votes.find((v) => v.userEmail === session?.user?.email);

  return (
    <a
      href=""
      onClick={(e) => {
        e.preventDefault();
        onOpen();
      }}
      className="my-8 flex gap-8 items-center"
    >
      <div className="flex-grow">
        <h2 className="font-bold">{title}</h2>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <div>
        {showLoginPopup && (
          <Popup title="Confirm your vote!" narrow setShow={setShowLoginPopup}>
            <div className="p-4">
              <Button primary onClick={handleGoogleLoginButtonClick}>
                Login with Google
              </Button>
            </div>
          </Popup>
        )}
        <Button primary={iVoted} onClick={handleVoteButtonClick} className="shadow-sm border">
          <span className="triangle-up"></span>
          {votes?.length || "0"}
        </Button>
      </div>
    </a>
  );
}
