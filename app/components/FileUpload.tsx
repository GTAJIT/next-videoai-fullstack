"use client"

import {
    upload,
} from "@imagekit/next";
import { useState } from "react";

interface FileUploadProps {
    onSuccess: (res: any) => void;
    onProgress?: (progress: number) => void;
    fileType?: "image" | "video";
}

const FileUpload = ({
    onSuccess,
    onProgress,
    fileType
}: FileUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string|null>(null);

    //op val'
    const validateFile = (file: File) => {
        if (!file.type.startsWith("video/")) {
            setError("Please upload a video file.");
            return false;
        }
        if (file.size > 100 * 1024 * 1024) { // 100 MB limit
            setError("File size exceeds 100 MB limit.");
            return false;
        }
        return true;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !validateFile) return;
        setUploading(true);
        setError(null);
        try {
            const authRes = await fetch("/api/auth/imagekit-auth")
            const auth = await authRes.json();

            const res = await upload({
                file,
                fileName: file.name,
                publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
                signature: auth.signature,
                expire: auth.expire,
                token: auth.token,
                onProgress: (event) => {
                    if(event.lengthComputable && onProgress) {
                        const progress = Math.round((event.loaded / event.total) * 100);
                        onProgress(progress);
                    }
                },
            });
            onSuccess(res);
        } catch (error) {
            console.log("Upload Failed", error);
        } finally {
            setUploading(false);
        }
    }
    return (
        <>
            <input
                type="file"
                accept={fileType === "video" ? "video/*" : "image/*"}
                onChange={handleFileChange}
            />
            {uploading && <p>Uploading...</p>}
        </>
    );
};

export default FileUpload;