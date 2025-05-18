import Popup from "./Popup";
import Button from "./Button";
import FeedbackItemPopupComments from "./FeedbackItemPopupComment";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Tick from "./icons/Tick";
import Edit from "@/app/components/icons/Edit";
import Trash from "./icons/Trash";

export default function FeedbackItemPopup({
  _id,
  title: initialTitle,
  setShow,
  description: initialDescription,
  votes,
  onVotesChange,
  image: initialImage,
  user,
  onUpdateFeedback,
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(initialTitle);
  const [newDescription, setNewDescription] = useState(initialDescription);
  const [editedImage, setEditedImage] = useState(initialImage);
  const [isSaving, setIsSaving] = useState(false);

  const { data: session } = useSession();

  function handleVoteButtonClick() {
    axios.post("/api/vote", { feedbackId: _id }).then(async () => {
      if (onVotesChange) {
        await onVotesChange();
      }
    });
  }

  function handleEditButtonClick() {
    setNewTitle(initialTitle);
    setNewDescription(initialDescription);
    setEditedImage(initialImage);
    setIsEditMode(true);
  }

  function handleCancelEdit() {
    setIsEditMode(false);
  }

  function handleRemoveImage() {
    setEditedImage(null);
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEditedImage(response.data.imagePath);
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image. Please try again.");
    }
  }

  async function handleSaveChanges() {
    setIsSaving(true);

    const updatedFeedbackData = {
      _id,
      title: newTitle,
      description: newDescription,
      image: editedImage,
      votes,
      user,
    };

    try {
      await axios.put(`/api/feedback/`, updatedFeedbackData);

      if (onUpdateFeedback) {
        onUpdateFeedback(updatedFeedbackData);
      }
      setIsEditMode(false);
    } catch (error) {
      console.error("Error saving feedback:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  const iVoted = !!votes.find((v) => v.userEmail === session?.user?.email);

  return (
    <Popup title={isEditMode ? "Edit Feedback" : ""} setShow={setShow}>
      <div className="p-8">
        {/* Title Section */}
        {isEditMode ? (
          <input
            className="block w-full mb-2 p-2 border rounded-md text-lg font-bold"
            value={newTitle}
            onChange={(ev) => setNewTitle(ev.target.value)}
            disabled={isSaving}
          />
        ) : (
          <h2 className="text-lg font-bold mb-2">{initialTitle}</h2>
        )}

        {/* Description Section */}
        {isEditMode ? (
          <textarea
            className="block w-full mb-2 p-2 border rounded-md min-h-[100px]"
            value={newDescription}
            onChange={(ev) => setNewDescription(ev.target.value)}
            disabled={isSaving}
          />
        ) : (
          <p className="text-gray-600 whitespace-pre-wrap">
            {initialDescription}
          </p>
        )}

        {/* Image Section */}
        {isEditMode ? (
          <div className="mt-4">
            {editedImage ? (
              <>
                <div className="mb-2 font-medium">Image:</div>
                <div className="relative inline-block w-fit">
                  <img
                    src={editedImage}
                    alt="Feedback preview"
                    className="rounded-md max-w-xs border"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isSaving}
                    className="absolute top-1 right-1 bg-white/80 text-black text-xs p-1 rounded-full hover:bg-red-600 hover:text-white"
                    aria-label="Remove image"
                  >
                    <Trash />
                  </button>
                </div>
              </>
            ) : initialImage ? (
              <p className="text-gray-500 italic mt-4">
                Image will be removed. Save changes to confirm.
              </p>
            ) : (
              <p className="text-gray-500 italic mt-4">No image.</p>
            )}
            {/* Attach New Image Input */}
            <div className="mt-4">
              <label className="block mb-1 font-medium">Attach New Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mb-2 block"
                disabled={isSaving}
              />
            </div>
          </div>
        ) : (
          initialImage?.trim() && (
            <div className="mt-4">
              <div className="mb-2 font-medium">Image:</div>
              <img
                src={initialImage}
                alt="Feedback"
                className="rounded-md max-w-xs border"
              />
            </div>
          )
        )}
      </div>

      <div className="flex gap-2 justify-end px-8 py-4 border-t">
        {isEditMode ? (
          <>
            <Button onClick={handleCancelEdit} disabled={isSaving}>
              Cancel
            </Button>
            <Button primary onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </>
        ) : (
          <>
            {user?.email && session?.user?.email === user?.email && (
              <Button onClick={handleEditButtonClick}>
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
            <Button
              primary={!iVoted}
              onClick={handleVoteButtonClick}
              className="shadow-sm border"
            >
              {iVoted ? (
                <>
                  <Tick className="w-4 h-4 mr-1" />
                  Upvoted {votes?.length || "0"}
                </>
              ) : (
                <>
                  <span className="triangle-up mr-1"></span>
                  Upvote {votes?.length || "0"}
                </>
              )}
            </Button>
          </>
        )}
      </div>

      {!isEditMode && (
        <div className="border-t">
          <FeedbackItemPopupComments feedbackId={_id} />
        </div>
      )}
    </Popup>
  );
}
