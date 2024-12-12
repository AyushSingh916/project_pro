"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

export default function UploadAvatar({username} : any) {
  const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const avatarRef = useRef<HTMLImageElement>(null);

  console.log(username)

  const updateUserIcon = async (url: string) => {
    try {
        await fetch('/api/user/update/image', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                url: url
            })
        })
    } catch(error) {
        console.error(error)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/user/upload-avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload avatar");

      const data = await response.json();
      console.log(data.url)
      updateUserIcon(data.url)
      setUploadedAvatar(data.publicId);
    } catch (error) {
      console.error(error);
      alert("Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };



  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Upload Avatar/Icon</h1>

      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">Choose an Avatar/Icon</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Select a file</span>
            </label>
            <input
              type="file"
              onChange={handleFileUpload}
              className="file-input file-input-bordered file-input-primary w-full"
            />
          </div>

          {isUploading && (
            <div className="mt-4">
              <progress className="progress progress-primary w-full"></progress>
            </div>
          )}

          {uploadedAvatar && (
            <div className="mt-6">
              <h2 className="card-title mb-4">Uploaded Avatar Preview</h2>
              <div className="flex justify-center">
                <Image
                  ref={avatarRef}
                  src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${uploadedAvatar}`}
                  alt="Uploaded Avatar"
                  className="rounded-full w-40 h-40 object-cover"
                />
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
