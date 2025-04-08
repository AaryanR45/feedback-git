import Button from "./Button";
import Popup from "@/app/components/Popup";
import { useState } from "react";
import axios from "axios";

export default function FeedbackFormPopup({ setShow }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleCreatePostButtonClick(ev) {
    ev.preventDefault();
    try {
      const res = await axios.post("/api/feedback", { title, description });
      console.log("Feedback saved:", res.data);
      setShow(false); // close popup
    } catch (err) {
      console.error("Error submitting feedback:", err);
    }
  }

  return (
    <Popup setShow={setShow} title="Make a suggestion">
      <form className="p-8">
        <label className="block mt-4 mb-1">Title</label>
        <input
          className="w-full border p-2 rounded"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className="block mt-4 mb-1">Details</label>
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Please include any details"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex gap-2 mt-4 justify-end">
          <Button>Attach files</Button>
          <Button primary="true" onClick={handleCreatePostButtonClick}>
            Create post
          </Button>
        </div>
      </form>
    </Popup>
  );
}
