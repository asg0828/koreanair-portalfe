import { uploadFile } from '@/api/FileAPI';
import { ValidType } from '@/models/common/Constants';
import { getFileDownloadPath } from '@/utils/ApiUtil';
import { useToast } from '@ke-design/components';
import { Editor } from '@tinymce/tinymce-react';
import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from 'react';
import './TinyEditor.scss';
import { useTranslation } from 'react-i18next';

export interface TinyEditorProps {
  content?: string;
  disabled?: boolean;
  onEditorChange?: (content: string, editor: any) => void;
}

const TinyEditor = forwardRef<ForwardedRef<Editor>, TinyEditorProps>(({ content, disabled, onEditorChange }, ref) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const editorRef = useRef<any>(null);

  useImperativeHandle(ref, () => editorRef.current.editor);

  const handleEditorChange = (content: string, editor: any) => {
    onEditorChange && onEditorChange(content, editor);
  };

  return (
    <Editor
      tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
      ref={editorRef}
      disabled={disabled}
      value={content}
      onEditorChange={handleEditorChange}
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
        file_picker_callback: disabled
          ? undefined
          : (callback, value, meta) => {
              if (meta.filetype === 'image') {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.click();
                input.onchange = () => {
                  const file = (input.files as FileList)[0];
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = function (e: ProgressEvent<FileReader>) {
                    callback((e.target as any).result, {
                      alt: file.name,
                      title: file.name,
                    });
                  };
                };
              }
            },
        images_upload_handler: disabled
          ? undefined
          : async (blobInfo) => {
              const formData = new FormData();
              formData.append('fileCl', 'image');
              formData.append('files', blobInfo.blob(), blobInfo.filename());

              return new Promise(async (resolve, reject) => {
                const response = await uploadFile(formData);

                if (response?.data?.[0]) {
                  const fileId = response.data[0];
                  resolve(`${getFileDownloadPath()}/${fileId}`);
                } else {
                  toast({
                    type: ValidType.ERROR,
                    content: t('common.toast.error.uploadImage'),
                  });
                  reject(false);
                }
              });
            },
      }}
    />
  );
});

export default TinyEditor;
