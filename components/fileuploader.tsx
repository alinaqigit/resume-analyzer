"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Inbox, Loader2 } from "lucide-react";
import { uploadToS3 } from "@/lib/s3";

const FileUpload: React.FC = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);

  // Mutation to create a chat after uploading to S3
  const mutation = useMutation({
    mutationFn: async (data: { file_key: string; file_name: string }) => {
      const response = await axios.post("/api/create-chat", data);
      return response.data;
    },
    onMutate: () => setUploading(true),
    onSettled: () => setUploading(false),
    onSuccess: (data) => {
      console.log("API Response:", data);
      toast.success("Chat created!");
      router.push(`/chat/${data.chat_id}`);
    },
    onError: (err) => {
      toast.error("Error creating chat");
      console.error(err);
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large (max 10MB)");
        return;
      }

      try {
        setUploading(true);
        // Upload file to S3
        const data = await uploadToS3(file);
        if (!data?.file_key || !data.file_name) {
          toast.error("Something went wrong during upload");
          return;
        }
        // Trigger the mutation to create chat
        mutation.mutate(data);
      } catch (error) {
        console.error(error);
        toast.error("Upload failed");
        setUploading(false);
      }
    },
  });

  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <>
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">
              Spilling Tea to GPT...
            </p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;