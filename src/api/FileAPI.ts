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

export const downloadFile = async (fileId: string) => {
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
    const blob = new Blob([response.data], { type: 'application/octet-stream' });
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.target = '_self';
    link.click();
    return true;
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
