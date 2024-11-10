"use client";

import { FileUp, LoaderCircle } from "lucide-react";
import style from "./fileupload.module.css";
import {
  FileRecord,
  FileUploadProvider,
  useFileUploadContext,
} from "@/lib/context";
import React, { useState } from "react";
import "./../globals.css";
import FileList from "./FileList";
import Tooltip from "./Tooltip";

interface FileUploadProps {
  children: React.ReactNode;
}

function FileUpload({ children }: FileUploadProps) {
  return (
    <FileUploadProvider>
      <div className={`${style.fileupload} shadow`}>{children}</div>
      <FileList />
    </FileUploadProvider>
  );
}

FileUpload.Header = () => {
  return (
    <h1 className={style.header}>
      <FileUp /> razorpay_payin
    </h1>
  );
};

FileUpload.Dropzone = () => {
  const { dispatch, state } = useFileUploadContext();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      await handleFileUpload(selectedFile);
    }
  };

  const handleFileUpload = async (file: File) => {
    const newFile: FileRecord = {
      filename: file.name,
      status: 0,
    };
    dispatch({ type: "ADD_FILE", payload: newFile });
    dispatch({ type: "SET_UPLOADING_STATE", payload: "uploading" });

    // Simulate upload
    const uploadDuration = Math.random() * 10 * 1000;
    const interval = 100;
    let elapsedTime = 0;

    const uploadInterval = setInterval(() => {
      elapsedTime += interval;
      const progress = Math.min((elapsedTime / uploadDuration) * 100, 100);
      setUploadProgress(progress);

      if (progress === 100) {
        clearInterval(uploadInterval);
        const isSuccess = Math.random() > 0.5;
        dispatch({
          type: "SET_UPLOADING_STATE",
          payload: isSuccess ? "success" : "error",
        });
        dispatch({
          type: "COMPLETE_FILE",
          payload: {
            filename: file.name,
            status: isSuccess ? 1 : -1,
          },
        });
        setTimeout(() => {
          dispatch({ type: "SET_UPLOADING_STATE", payload: "idle" });
        }, 2000);
      }
    }, interval);
  };

  const getStateMessage = () => {
    switch (state.uploadingState) {
      case "uploading":
        return `Uploading... ${uploadProgress.toFixed(2)}%`;
      case "success":
        return `Upload successful! \n ${state.files
          .at(-1)
          ?.filename.substring(0, 10)}...`;
      case "error":
        return "Upload failed. Please try again.";
      default:
        return "Drag and drop your file here or click to browse";
    }
  };

  const stateComponents = {
    idle: (
      <>
        <svg
          className={style.uploadIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
        <div className={style.message}>{getStateMessage()}</div>
        <div className={style.hint}>Maximum file size: 10MB</div>
      </>
    ),
    uploading: (
      <div className={style.progressContainer}>
        <LoaderCircle
          style={{
            animation: "spin 1s linear infinite",
          }}
          className={style.spinner}
        />
        <div className={style.message}>{getStateMessage()}</div>
        <div className={style.progressBar} style={{ width: `${uploadProgress}%` }} />
      </div>
    ),
    success: (
      <div className={style.progressContainer}>
        <svg
          className={style.successIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
        <div className={style.message}>{getStateMessage()}</div>
      </div>
    ),
    error: (
      <div className={style.progressContainer}>
        <svg
          className={style.errorIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
        <div className={style.message}>{getStateMessage()}</div>
      </div>
    ),
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (state.uploadingState === "uploading") return;
    dispatch({ type: "SET_DRAGGING", payload: true });
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (state.uploadingState === "uploading") return;
    dispatch({ type: "SET_DRAGGING", payload: false });
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (state.uploadingState === "uploading") return;
    dispatch({ type: "SET_DRAGGING", payload: false });

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      await handleFileUpload(droppedFile);
    }
  };

  return (
    <div
      className={`${style.uploadArea} ${
        state.isDragging ? style.dragging : ""
      } ${style[state.uploadingState]}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => {
        if (state.uploadingState === "uploading") return;
        fileInputRef.current?.click();
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        className={style.fileInput}
        onChange={handleFileSelect}
        accept="*"
      />

      <div className={style.content}>
        <div>{stateComponents[state.uploadingState]}</div>
      </div>
    </div>
  );
};

FileUpload.Status = () => {
  const { state } = useFileUploadContext();
  const stateMap = {
    idle: state.files.length
      ? `Done . ${state.completedCount}/${state.files.length} Success`
      : "No file uploaded",
    uploading: `Running . ${state.completedCount}/${state.files.length} Complete`,
    success: `Done . ${state.completedCount}/${state.files.length} Success`,
    error: "No file uploaded",
  };
  return (
    <div className={style.status}>
      {stateMap[state.uploadingState]}
      <Tooltip files={state.files} />
    </div>
  );
};

export default FileUpload;