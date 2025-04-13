import Button from "./Button";
import Popup from "@/app/components/Popup";
import axios from "axios";
import Trash from "./icons/Trash";
import { useState, useRef } from "react";

export default function FeedbackFormPopup({ setShow,onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePath, setImagePath] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("image", selectedImage);

    setIsLoading(true);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImagePath(response.data.imagePath);
      response.data.imagePath;
    } catch (error) {
      alert("Only image file allowed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePostButtonClick = async (ev) => {
    ev.preventDefault();
    if (!title || !description) {
      alert("Title and description are required!");
      return;
    }

    try {
      const res = await axios.post("/api/feedback", {
        title,
        description,
        image: imagePath,
      });
      setShow(false);
      onCreate();
    } catch (err) {
      alert("Failed to upload image. Please try again.");
    }
  };

  const fileInputRef = useRef(null);
  const removeUpload = async (ev, link) => {
    ev.preventDefault();

    try {
      await axios.delete("/api/upload", {
        data: { imagePath: link },
      });
      setImagePath("");
      setSelectedImage(null);
      fileInputRef.current.value = null;
    } catch (err) {
      console.error("Failed to delete image:", err);
    }
  };
  return (
    <Popup setShow={setShow} title="Make a suggestion">
      <form className="p-8" onSubmit={handleCreatePostButtonClick}>
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
        <label className="block mt-4 mb-1">Attach image</label>
        <input
          type="file"
          onChange={handleImageChange}
          className="mb-2"
          ref={fileInputRef}
        />
        {imagePath && (
          <div className="mb-4 relative flex flex-col">
            <p className="text-sm text-gray-600">Uploaded image:</p>
            <div className="relative w-fit">
              <img
                src={imagePath}
                alt="Uploaded"
                className=" w-auto h-40 mt-1 rounded border border-gray-300"
              />
              <button
                onClick={(ev) => removeUpload(ev, imagePath)}
                className="absolute -top-2 -right-2 bg-gray-200 text-black text-xs p-1  rounded-md hover:bg-red-600"
              >
                <Trash />
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4 justify-end">
          <button
            type="button"
            onClick={handleImageUpload}
            className="mb-4 px-4 py-2 bg-gray-100 rounded text-sm"
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Attach files"}
          </button>
          <Button
            primary
            type="submit"
            className="mb-4 px-4 py-2 bg-blue-500 rounded text-sm"
          >
            Create post
          </Button>
        </div>
      </form>
    </Popup>
  );
}
