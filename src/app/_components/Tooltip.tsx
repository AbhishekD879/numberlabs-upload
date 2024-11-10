import { useState } from "react";
import { File, Info } from "lucide-react";
import style from "./tooltip.module.css";
import { FileRecord } from "@/lib/context";
function Tooltip({ files }: { files: FileRecord[] }) {
  const [show, setShow] = useState(false);

  return (
    <div
      className={style.tooltipContainer}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <Info size={20} fill="#000" color="white" />
      {show && (
        <div
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
          className={style.tooltipContent}
        >
          <h6 className={style.title}>Files not uploaded</h6>  
          <ul className={style.list}>
            {files
              .filter((file: FileRecord) => file.status === -1)
              .map((file, index) => (
                <li
                  key={`${file.filename}-${index}`}
                  className={style.fileItem}
                >
                  <File size={15} color="white" />
                  <p className={style.fileName}>{file.filename.substring(0,10)}</p>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Tooltip;
