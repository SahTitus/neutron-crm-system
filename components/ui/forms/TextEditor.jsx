"use client";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import { textEditorValues } from "@utils/libConfigValues";
import { Thinking } from "@components/common/loaders/Thinking";

const ReactQuill = dynamic(() => {
  return import("react-quill")
}, {
  ssr: false,
  loading: () => <div ><Thinking /></div>
})

export const TextEditor = ({ code, setFieldValue }) => {
  const handleContentChange = (msg, delta, e, source, editor) => {
    setFieldValue('content', msg)
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      require("quill/dist/quill.snow.css");
    }
  }, []);

  return (
    <>
      <ReactQuill
        theme="snow"
        modules={textEditorValues?.modules}
        formats={textEditorValues?.formats}
        value={code}
        onChange={handleContentChange}
        className="scrollbar-hide h-[450px] mb-28 text-base dark:text-gray-300 "
      />
    </>
  );
};