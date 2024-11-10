'use client'
import FileUpload from "./_components/FileUpload";
import style from "./page.module.css";
export default function Home() {
  return (
    <div className={style.container}>
      <FileUpload>
        <FileUpload.Header />
        <FileUpload.Status />
        <FileUpload.Dropzone />
      </FileUpload>
    </div>
  );
}
