"use client";

import { ImageUp, Trash2Icon } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { type PutBlobResult } from "@vercel/blob";
import { toast } from "sonner";

interface ImageUploaderProps {
  initialImage?: string;
  onImageUpload: (url: string) => void;
  onImageRemove: () => void;
}

const ImageUploader = ({
  initialImage = "",
  onImageUpload,
  onImageRemove,
}: ImageUploaderProps) => {
  const [image, setImage] = useState(initialImage);
  const [isUploading, setIsUploading] = useState(false);
  const inputImageRef = useRef<HTMLInputElement>(null);

  const handleUploadImage = useCallback(async () => {
    if (!inputImageRef.current?.files) return null;

    const imageFile = inputImageRef.current.files[0];

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.set("file", imageFile);
      formData.set("timestamp", Date.now().toString());

      const response = await fetch("/api/upload", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data: PutBlobResult = await response.json();
      setImage(data.url);
      onImageUpload(data.url);
      toast.success("Image uploaded successfully", { duration: 1500 });
    } catch (error) {
      setIsUploading(false);
      console.log({ error });
      toast.error(
        `Failed to upload image: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setIsUploading(false);
    }
  }, [onImageUpload]);

  const handleRemoveImage = useCallback(async () => {
    if (!image) return;

    try {
      setIsUploading(true);
      const response = await fetch(`/api/upload?imageUrl=${image}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete image");
      }

      setImage("");
      onImageRemove();
      toast.success("Image deleted successfully", { duration: 1500 });
    } catch (error) {
      setIsUploading(false);
      console.error(error);
      toast.error(
        `Failed to delete image: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setIsUploading(false);
    }
  }, [image, onImageRemove]);

  return (
    <div className="flex-center flex-col gap-2">
      <label
        htmlFor="image"
        className="flex-center relative aspect-square h-[200px] w-[200px] cursor-pointer flex-col rounded-md border-2 border-dashed object-cover"
      >
        {isUploading && (
          <div className="progress-loader">
            <div className="progress" />
          </div>
        )}
        {!image && !isUploading ? (
          <>
            <ImageUp size={100} strokeWidth={0.5} />
            <p className="mb-1 text-sm font-semibold">Upload Image</p>
            <input
              id="image"
              type="file"
              ref={inputImageRef}
              onChange={handleUploadImage}
              className="hidden"
              accept="image/*"
              disabled={isUploading}
            />
          </>
        ) : (
          <>
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2"
              disabled={isUploading}
              onClick={(e) => {
                e.preventDefault();
                handleRemoveImage();
              }}
            >
              <Trash2Icon />
            </Button>
            <Image
              src={image}
              alt="image"
              width={200}
              height={200}
              className="flex-center h-full w-full rounded-md object-contain transition-all duration-300 ease-in-out"
            />
          </>
        )}
      </label>
    </div>
  );
};

export default ImageUploader;
