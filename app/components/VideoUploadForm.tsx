"use client";

import { useState } from "react";
import FileUpload from "./FileUpload";
import { VIDEO_DIMENSIONS } from "@/models/Video";

export default function VideoUploadForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !videoUrl) {
      return setMessage("All fields are required.");
    }

    setUploading(true);
    try {
      const res = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          videoUrl,
          thumbnailUrl: thumbnailUrl || videoUrl + "/ik-thumbnail.jpg", // fallback thumbnail
          transformation: {
            height: VIDEO_DIMENSIONS.height,
            width: VIDEO_DIMENSIONS.width,
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to upload video metadata");

      setMessage("Video uploaded successfully!");
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setThumbnailUrl("");
    } catch (err) {
      console.error(err);
      setMessage("Error uploading video");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
      <div>
        <label className="block font-medium">Video Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Upload Video</label>
        <FileUpload
          fileType="video"
          onSuccess={(res: any) => {
            console.log("Upload success:", res);
            setVideoUrl(res.url);
          }}
        />
        {videoUrl && <p className="text-sm mt-1 text-success">Uploaded to: {videoUrl}</p>}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={uploading || !videoUrl}
      >
        {uploading ? "Submitting..." : "Submit Video"}
      </button>

      {message && <p className="text-center mt-2">{message}</p>}
    </form>
  );
}
