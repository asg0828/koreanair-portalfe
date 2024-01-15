import { downloadImage, uploadFile } from '@/api/FileAPI';
import { ValidType } from '@/models/common/Constants';
import {
  exceptTagReg,
  imageBlobSrc,
  imageId,
  imageIdReg,
  imageSrc,
  imageTagReg,
  imageTitleReg,
} from '@/utils/RegularExpression';
import { useToast } from '@ke-design/components';
import { Editor } from '@tinymce/tinymce-react';
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './TinyEditor.scss';

export interface TinyEditorProps {
  content?: string;
  disabled?: boolean;
  onEditorChange?: (content: string, editor: any) => void;
}

const TinyEditor = forwardRef<ForwardedRef<Editor>, TinyEditorProps>(
  ({ content = '', disabled, onEditorChange }, ref) => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const editorRef = useRef<any>(null);
    const [fileId, setFileId] = useState<string>('');
    const [isLoadedData, setIsLoadedData] = useState<boolean>(false);
    const [uploadFileInfo, setUploadFileInfo] = useState<any>({
      blobInfo: null,
      filename: null,
    });

    useImperativeHandle(ref, () => editorRef.current.editor);

    const handleEditorChange = (cn: string, editor: any) => {
      cn.replace(imageTagReg, (imgTagMatched: any) => {
        const isId = imgTagMatched.match(imageIdReg);
        if (isId) {
          return;
        }
        const titleMachted = imgTagMatched.match(imageTitleReg)?.[0];
        let blobSrc = imgTagMatched.match(imageBlobSrc)?.[0];

        if (titleMachted) {
          const filename = titleMachted.substring(7, titleMachted.length - 1);

          if (filename && blobSrc) {
            blobSrc = blobSrc.substring(1, blobSrc.length - 1);

            //data:image/png;base64, 문자열 기준 왼쪽에서 type 추출, 오른쪽에서 base64를 추출하여 blob객체 생성
            const blobData = blobSrc.split(',');
            const type = blobData[0].substring(5, blobData[0].length - 7);
            const base64Data = blobData[1];
            const decodedData = atob(base64Data);
            const arrayBuffer = new Uint8Array(decodedData.length);
            for (let i = 0; i < decodedData.length; i++) {
              arrayBuffer[i] = decodedData.charCodeAt(i);
            }
            const blobInfo = new Blob([arrayBuffer], { type: type });

            setUploadFileInfo((prevState: any) => {
              if (blobInfo !== prevState.blobInfo) {
                return { ...prevState, blobInfo, filename };
              }

              return prevState;
            });
          }
        }

        return imgTagMatched;
      });

      onEditorChange && onEditorChange(cn.replace(exceptTagReg, ''), editor);
    };

    const handleFilePicker = (callback: Function, value: string, meta: any) => {
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
    };

    const handleImageUpload = (blobInfo: any, filename: string) => {
      const formData = new FormData();
      formData.append('fileCl', 'image');
      formData.append('files', blobInfo, filename);

      return new Promise(async (resolve, reject) => {
        const response = await uploadFile(formData);
        if (response?.data?.[0]) {
          const fileId = response.data[0];
          setFileId(fileId);
        } else {
          toast({
            type: ValidType.ERROR,
            content: t('common.toast.error.uploadImage'),
          });
        }
      });
    };

    useEffect(() => {
      if (uploadFileInfo.blobInfo) {
        handleImageUpload(uploadFileInfo.blobInfo, uploadFileInfo.filename);
      }
    }, [uploadFileInfo]);

    useEffect(() => {
      if (fileId) {
        const newContent = content.replace(imageSrc, (str) => {
          return `id="${fileId}" ${str}`;
        });
        onEditorChange && onEditorChange(newContent, editorRef?.current?.editor);
      }

      return () => {
        setFileId('');
      };
    }, [fileId]);

    useEffect(() => {
      async function downloadImageAsync() {
        const fileList: Array<string> = [];
        content.replace(imageTagReg, (str) => {
          str.replace(imageId, (str) => {
            fileList.push(str);
            return str;
          });
          return str;
        });

        let newContent = content;
        for (const fileId of fileList) {
          const blobURL = await downloadImage(fileId);
          const regex = new RegExp(`id="${fileId}"`);
          newContent = newContent.replace(regex, (str) => {
            return `${str} src="${blobURL}"`;
          });
        }

        onEditorChange && onEditorChange(newContent, editorRef?.current?.editor);
      }

      if (!isLoadedData && content) {
        downloadImageAsync();
      }

      return () => {
        setIsLoadedData(true);
      };
    }, [content]);

    return (
      <Editor
        tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
        ref={editorRef}
        disabled={disabled}
        onEditorChange={handleEditorChange}
        value={content}
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
          file_picker_types: 'image',
          automatic_uploads: false,
          file_picker_callback: handleFilePicker,
          // images_upload_handler: handleImageUpload,
        }}
      />
    );
  }
);

export default TinyEditor;
