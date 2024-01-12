import { PortalApiURL } from '@/models/common/ApiURL';
import { Service } from '@/models/common/Service';
import { callApiForFile, Method } from '@utils/ApiUtil';

export const uploadFile = (formData: FormData) => {
  return callApiForFile({
    service: Service.KAL_BE,
    url: `${PortalApiURL.FILE}/upload`,
    method: Method.POST,
    params: {
      bodyParams: formData,
    },
    config: {
      isFile: true,
    },
  });
};

export const downloadFile = async (fileId: string, fileNm?: string) => {
  const response = await callApiForFile({
    service: Service.KAL_BE,
    url: `${PortalApiURL.FILE}/download/${fileId}`,
    method: Method.GET,
    config: {
      isFile: true,
    },
  });

  if (response?.successOrNot === 'N') {
    return false;
  } else {
    const link = document.createElement('a');
    const blobURL = window.URL.createObjectURL(response.data);
    const contentDisposition = response.headers['content-disposition'];
    const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
    const fileName = fileNameMatch ? fileNameMatch[1] : fileNm;
    link.href = blobURL;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(blobURL);
    return true;
  }
};

export const downloadImage = async (fileId: string) => {
  const response = await callApiForFile({
    service: Service.KAL_BE,
    url: `${PortalApiURL.FILE}/download/${fileId}`,
    method: Method.GET,
    config: {
      isFile: true,
    },
  });

  if (response?.successOrNot === 'N') {
    return '';
  } else {
    const blobURL = window.URL.createObjectURL(response.data);
    return blobURL;
  }
};

export const deleteFile = (fileId: string) => {
  return callApiForFile({
    service: Service.KAL_BE,
    url: `${PortalApiURL.FILE}/delete/${fileId}`,
    method: Method.POST,
    config: {
      isFile: true,
    },
  });
};
