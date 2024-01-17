import { HighlightOffIcon, UploadIcon } from '@/assets/icons';
import FileUploadFallback from '@/components/fallback/FileUploadFallback';
import { useDeleteFile, useUploadFile } from '@/hooks/mutations/useFileMutations';
import { ValidType } from '@/models/common/Constants';
import { FileCl } from '@/models/model/FileModel';
import { getFileSize } from '@/utils/FileUtil';
import { Stack, Typography, useToast } from '@components/ui';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import './UploadDropzone.scss';

export interface UploadDropzoneProps {
  fileCl?: FileCl;
  fileList?: Array<any>;
  uploadFiles?: (files: Array<any>) => void;
}

export interface Params {
  addedFiles: Array<any>;
  formData: FormData;
}

const UploadDropzone = ({ fileCl = '', fileList = [], uploadFiles }: UploadDropzoneProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    onDropRejected: handleDropRejected,
    onDrop: handleDrop,
    maxSize: 1024 * 1024 * 500,
    maxFiles: 10,
  });
  const [fileId, setFileId] = useState<string>('');
  const [files, setFiles] = useState<Array<any>>(fileList);
  const [addedFiles, setAddedFiles] = useState<Array<any>>([]);
  const [formData, setFormData] = useState<FormData>(new FormData());
  const { data: response, isSuccess, isError, isLoading, mutate } = useUploadFile(formData);
  const {
    data: dResponse,
    isSuccess: dIsSuccess,
    isError: dIsError,
    isLoading: dIsLoading,
    mutate: dMutate,
  } = useDeleteFile(fileId);

  const removeFile = (nFileId: string) => () => {
    setFileId(nFileId);
  };

  const hasFile = (file: any) => {
    return files.some(
      (oFile) =>
        oFile.name === file.name &&
        oFile.size === file.size &&
        oFile.lastModified.toString() &&
        file.lastModified.toString()
    );
  };

  function handleDropRejected(rejectedFiles: Array<any>) {
    toast({
      type: ValidType.INFO,
      content: rejectedFiles[0].errors[0].message,
    });
  }

  function handleDrop(acceptedFiles: Array<any>) {
    if (isLoading) {
      toast({
        type: ValidType.INFO,
        content: t('common.toast.info.uploadingFile'),
      });
      return;
    }

    const nAddedFiles: Array<any> = [];

    acceptedFiles.forEach((file) => {
      if (hasFile(file)) {
        toast({
          type: ValidType.ERROR,
          content: `${file.name} ${t('common.toast.info.existsFile')}`,
        });
      } else {
        nAddedFiles.push(file);
      }
    });

    if (nAddedFiles.length > 0) {
      const nFormData = new FormData();
      nFormData.append('fileCl', fileCl);
      nAddedFiles.forEach((file) => {
        nFormData.append('files', file);
      });
      setAddedFiles(nAddedFiles);
      setFormData(nFormData);
    }
  }

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('common.toast.error.upload'),
      });
    } else if (isSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: t('common.toast.success.upload'),
      });

      if (response.data) {
        (async () => {
          await Promise.all(
            addedFiles.map((file: any, index: number) => {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                  file.fileId = response.data[index];
                  file.fileNm = file.name;
                  file.fileSize = file.size;
                  file.fileSizeNm = getFileSize(file.size);
                  resolve(file);
                };
              });
            })
          );

          const newFiles = [...files, ...addedFiles];
          setFiles(newFiles);
          uploadFiles && uploadFiles(newFiles);
        })();
      }
    }
  }, [response, isSuccess, isError, toast]);

  useEffect(() => {
    if (dIsError || dResponse?.successOrNot === 'N') {
      toast({
        type: ValidType.ERROR,
        content: t('common.toast.error.deleteFile'),
      });
    } else if (dIsSuccess) {
      toast({
        type: ValidType.CONFIRM,
        content: t('common.toast.success.deleteFile'),
      });

      setFiles((prevState) => prevState.filter((file) => file.fileId !== fileId));
    }
  }, [dResponse, dIsSuccess, dIsError, toast]);

  useEffect(() => {
    if (formData && addedFiles.length > 0) {
      formData && mutate();
    }
  }, [formData, addedFiles, mutate]);

  useEffect(() => {
    fileId && dMutate();
  }, [fileId, dMutate]);

  useEffect(() => {
    setFiles(fileList);
  }, [fileList]);

  return (
    <>
      <Stack direction="Vertical" className="width-100 height-100">
        <Stack className="height-100 relative">
          {(isLoading || dIsLoading) && <FileUploadFallback />}
          <Stack className={`dropzone-container ${isDragActive ? 'active' : ''}`} {...getRootProps()}>
            <input {...getInputProps()} />

            {files.length === 0 ? (
              <Stack justifyContent="Center" className="width-100 height-100">
                <UploadIcon />
                <Typography variant="body1">{t('common.message.dropFile')}</Typography>
              </Stack>
            ) : (
              files.map((file) => (
                <Stack
                  direction="Vertical"
                  className="file-container"
                  onClick={(e) => e.stopPropagation()}
                  key={`${file.fileId}`}
                >
                  <Stack justifyContent="End">
                    <HighlightOffIcon fontSize="small" onClick={removeFile(file.fileId)} />
                  </Stack>
                  <Stack direction="Vertical" alignItems="Center">
                    <Typography variant="body1" className="file-name">
                      {file.fileNm}
                    </Typography>
                    <Typography variant="body2" className="file-name">
                      {file.fileSizeNm}
                    </Typography>
                  </Stack>
                </Stack>
              ))
            )}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default UploadDropzone;
