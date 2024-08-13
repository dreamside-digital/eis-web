"use client"

import { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';


const RichTextEditor = ({onChange, value}) => {

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_KEY}
      value={value}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'lists link image'
        ],
        toolbar: 'undo redo | formatselect | bold italic backcolor | \
          link image | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | help',
        content_style: 'body { font-family: Poppins,Helvetica,Arial,sans-serif; font-size:14px }'
      }}
      onEditorChange={(newContent) => onChange(newContent)}
    />
  );
};

export default RichTextEditor;
