import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Stack, Typography, useToast } from '@components/ui';
import { UploadIcon, HighlightOffIcon } from '@/assets/icons';
import './UploadDropzone.scss';

export interface UploadDropzoneProps {
  uploadFiles?: Function
}

const UploadDropzone = ({
  uploadFiles
}: UploadDropzoneProps) => {
  const [files, setFiles] = useState<any[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: any[]) => {
    const nextFiles: any[] = [];

    await Promise.all(acceptedFiles.map((file: any) => {
      return new Promise((resolve, reject) => {
        if (hasFile(file)) {
          toast({
            type: 'Error',
            content: '파일이 이미 존재합니다.',
          });
          reject(false);
        } else {
          const reader = new FileReader;
          reader.readAsDataURL(file);
          reader.onload = () => {
            file.preview = reader.result;
            file.fileSize = getFileSize(file.size);
            resolve(file);
          }
        }
      }).then((file) => {
        nextFiles.push(file);
      }).catch(() => {
      });
    }))

    setFiles((prevFiles: any) => [...prevFiles, ...nextFiles]);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 1024 * 1024 * 5,
    maxFiles: 10,
  });

  const hasFile = (file: any) => {
    return files.some(oFile => oFile.name === file.name && oFile.size === file.size && oFile.lastModified.toString() && file.lastModified.toString());
  }
  
  const getFileSize = (filesize: number) => {
    var text = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
    var e = Math.floor(Math.log(filesize) / Math.log(1024));
    return (filesize / Math.pow(1024, e)).toFixed(2) + " " + text[e];
  };

  const removeFile = (file: any) => () => {
    const newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles);
  }

  const removeAll = () => {
    setFiles([]);
  }

  return (
    <Stack direction="Vertical" className="width-100 height-100">
      <Stack className="height-100">
        <Stack
          className={`dropzone-container ${isDragActive ? 'active' : ''}`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          
          {files.length === 0 ? (
            <Stack justifyContent="Center" className="width-100 height-100">
              <UploadIcon />
              <Typography variant="body1">DROP FILES HERE OR CLICK TO UPLOAD.</Typography>
            </Stack>
          ): (
            files.map((file) => (
              <Stack
                direction="Vertical"
                className="file-container"
                onClick={(e) => e.stopPropagation()}
                key={`${file.name}_${file.size}_${file.lastModified}`}
              >
                <Stack justifyContent="End">
                  <HighlightOffIcon fontSize="small" onClick={removeFile(file)} />
                </Stack>
                <Stack
                  direction="Vertical"
                  alignItems="Center"
                >
                  <img src={file.preview} className="preview" />
                  <Typography variant="body1" className="file-name">{file.name}</Typography>
                  <Typography variant="body2" className="file-name">{file.fileSize}</Typography>
                </Stack>
              </Stack>
            ))
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
export default UploadDropzone;
