"use client";

import { useState } from "react";
import FileUpload from "./FileUpload";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";

export default function VideoUploadForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !videoUrl) {
      return setMessage({ text: "All fields are required.", type: "error" });
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
          thumbnailUrl: thumbnailUrl || videoUrl + "/ik-thumbnail.jpg",
        }),
      });

      if (!res.ok) throw new Error("Failed to upload video metadata");

      setMessage({ text: "Video uploaded successfully!", type: "success" });
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setThumbnailUrl("");
    } catch (err) {
      console.error(err);
      setMessage({ text: "Error uploading video", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-base-200 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload New Video</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Video Title</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered w-full focus:input-primary"
              placeholder="Enter video title"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered min-w-[500px] focus:textarea-primary"
              placeholder="Enter video description"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Upload Video</span>
            </label>
            <div className="border-2 border-dashed border-base-300 rounded-lg p-6">
              {!videoUrl ? (
                <FileUpload
                  fileType="video"
                  onSuccess={(res: unknown) => {
                    if (res && typeof res === "object" && "url" in res) {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      setVideoUrl((res as { url: any }).url);
                      setMessage({ text: "Video uploaded successfully!", type: "success" });
                    }
                  }}
                />
              ) : (
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm">Video uploaded successfully</span>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full gap-2"
            disabled={uploading || !videoUrl}
          >
            {uploading ? (
              <>
                <span className="loading loading-spinner"></span>
                Processing...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Submit Video
              </>
            )}
          </button>

          {message.text && (
            <div
              className={`alert ${
                message.type === "success" ? "alert-success" : "alert-error"
              } mt-4`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
