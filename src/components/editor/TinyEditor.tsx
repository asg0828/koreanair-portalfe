import { useRef, useState, useEffect, forwardRef, useImperativeHandle, ForwardedRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import './TinyEditor.scss';

export interface TinyEditorProps {
  content?: string;
  disabled?: boolean;
  onEditorChange?: (content: string, editor: any) => void;
}

const TinyEditor = forwardRef<ForwardedRef<Editor>, TinyEditorProps>(({ content, disabled, onEditorChange }, ref) => {
  const editorRef = useRef<any>(null);
  const [editorContent, setEditorContent] = useState(content);

  useEffect(() => {
    setEditorContent(content);
  }, [content]);

  useImperativeHandle(ref, () => editorRef.current.editor);

  const handleEditorChange = (content: string, editor: any) => {
    setEditorContent(content);
    onEditorChange && onEditorChange(content, editor);
  };

  const initEditorContentStyle = () => {
    const iframe = (document.querySelector('.tox-edit-area iframe') as HTMLIFrameElement).contentWindow;
    const html = iframe?.document.querySelector('html');
    const body = iframe?.document.querySelector('body');
  };

  return (
    <Editor
      tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
      ref={editorRef}
      onLoadContent={initEditorContentStyle}
      value={editorContent}
      onEditorChange={handleEditorChange}
      disabled={disabled}
      init={{
        height: '100%',
        menubar: false,
        statusbar: false,
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'preview',
          'help',
          'wordcount',
          'image',
        ],
        toolbar: disabled
          ? false
          : 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | link image table tabledeletes | ' +
            'code help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        image_title: true,
        automatic_uploads: true,
        file_picker_types: 'image',
        file_picker_callback: function (callback, value, meta) {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();

          input.onchange = () => {
            const file = (input.files as FileList)[0];
            const reader = new FileReader();
            reader.onload = function (e: ProgressEvent<FileReader>) {
              callback((e.target as any).result, {
                alt: 'alternative-url',
                title: file.name,
              });
            };
            reader.readAsDataURL(file);
          };
        },
        // images_upload_handler: (blobInfo) => {
        //   return new Promise((resolve, reject) => {
        //     const formData = new FormData();
        //     formData.append('image', blobInfo.blob());

        //     resolve('test-url');
        //   })
        // },
      }}
    />
  );
});

export default TinyEditor;
