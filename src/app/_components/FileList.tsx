import React from "react";
import styles from "./fileList.module.css";
import { useFileUploadContext } from "@/lib/context";

const STATUS_MAP = {
  0: { label: "Pending", className: styles.statusPending },
  1: { label: "Success", className: styles.statusSuccess },
  [-1]: { label: "Failed", className: styles.statusFailed },
};

const FileList = () => {
  const {
    state: { files },
  } = useFileUploadContext();
  const isAllProcessed = () => {
    return files.every((file) => file.status !== 0);
  };
  console.log("FileList",files);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Uploaded Files</h3>
        <span
          className={`${styles.status} ${
            isAllProcessed() ? styles.statusComplete : styles.statusProcessing
          }`}
        >
          {isAllProcessed() ? "Complete" : "Processing"}
        </span>
      </div>

      {files.map((file, index) => (
        <div key={`${file.filename}-${index}`} className={styles.fileItem}>
          <span className={styles.fileName}>{file.filename}</span>
          <span
            className={`${styles.fileStatus} ${
              STATUS_MAP[file.status].className
            }`}
          >
            {STATUS_MAP[file.status].label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default FileList;
