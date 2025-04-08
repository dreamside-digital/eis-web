"use client"

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
const Editor = dynamic(() => import('@tinymce/tinymce-react').then(mod => mod.Editor), { ssr: false });

const RichTextEditor = ({onChange, value, onRender}) => {
  useEffect(() => {
    if (onRender) {
      onRender();
    }
  }, [onRender]);

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_KEY}
      value={value}
      init={{
        height: 300,
        menubar: false,
        plugins: 'anchor autolink charmap codesample emoticons image link lists media table visualblocks wordcount linkchecker',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | spellcheckdialog | removeformat',
        content_style: `body { font-family: Helvetica, Arial, sans-serif; font-size:14px }`
      }}
      onEditorChange={(newContent) => onChange(newContent)}
    />
  );
};

export default RichTextEditor;
