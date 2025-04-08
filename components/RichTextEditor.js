"use client"

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
const Editor = dynamic(() => import('@tinymce/tinymce-react').then(mod => mod.Editor), { ssr: false });

const RichTextEditor = ({onChange, value, onRender, hintText}) => {
  const editorRef = useRef(null);

  const initEditor = (_evt, editor) => {
    editorRef.current = editor;
  }

  useEffect(() => {
    if (onRender) {
      onRender();
    }
  }, [onRender]);

  return (
    <div className="space-y-4">
        <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_KEY}
        initialValue={value}
        init={{
          height: 300,
          menubar: false,
          plugins: 'anchor autolink charmap codesample emoticons image link lists media table visualblocks wordcount linkchecker',
          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | spellcheckdialog | removeformat',
          content_style: `body { font-family: Helvetica, Arial, sans-serif; font-size:14px }`
        }}
        onInit={initEditor}
        // onEditorChange={(newContent) => onChange(newContent)}
      />
      
      <div className="flex justify-between items-start gap-4">
        <small className="mb-2 block">{hintText}</small>
        <button 
          onClick={() => onChange(editorRef.current.getContent())}
          className="btn"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default RichTextEditor;
