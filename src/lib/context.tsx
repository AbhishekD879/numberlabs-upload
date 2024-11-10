"use client";
import React, { ReactNode } from "react";

export interface FileRecord {
  filename: string;
  status: -1 | 0 | 1;
}

type FileUploadContextType = {
  state: {
    files: FileRecord[];
    completedCount: number;
    error: string;
    isDragging: boolean;
    uploadingState: "idle" | "uploading" | "success" | "error";
  };
  dispatch: React.Dispatch<Action>;
};

const initialState: FileUploadContextType = {
  state: {
    files: [
      { filename: "file1.csv", status: 0 },

      { filename: "file2.csv", status: 1 },

      { filename: "file3.csv", status: -1 },
    ],
    completedCount: 1,
    uploadingState: "idle",
    error: "",
    isDragging: false,
  },
  dispatch: () => {},
};

export const FileUploadContext =
  React.createContext<FileUploadContextType>(initialState);

type FileUploadProviderProps = {
  children: ReactNode;
};

export const useFileUploadContext = () => {
  const context = React.useContext(FileUploadContext);
  if (!context) {
    throw new Error(
      "useFileUploadContext must be used within a FileUploadProvider"
    );
  }
  return context;
};

type Action = {
  type:
    | "ADD_FILE"
    | "REMOVE_FILE"
    | "COMPLETE_FILE"
    | "ERROR"
    | "SET_DRAGGING"
    | "SET_UPLOADING_STATE";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
};

const reducer = (state: FileUploadContextType["state"], action: Action) => {
  switch (action.type) {
    case "ADD_FILE":
      return {
        ...state,
        files: [...state.files, action.payload],
      };
    case "REMOVE_FILE":
      return {
        ...state,
        files: state.files.filter(
          (file: FileRecord) => file !== action.payload
        ),
      };
    case "COMPLETE_FILE":
      return {
        ...state,
        completedCount: state.completedCount + 1,
        files: state.files.map((file: FileRecord) => {
          if (file.filename === action.payload.filename) {
            return {
              ...file,
              status: action.payload.status,
            };
          }
          return file;
        }),
      };
    case "ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "SET_DRAGGING":
      return {
        ...state,
        isDragging: action.payload,
      };
    case "SET_UPLOADING_STATE":
      return {
        ...state,
        uploadingState: action.payload,
      };
    default:
      return state;
  }
};

export const FileUploadProvider = ({ children }: FileUploadProviderProps) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [state, dispatch] = React.useReducer(reducer, initialState.state);
  return (
    <FileUploadContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </FileUploadContext.Provider>
  );
};
