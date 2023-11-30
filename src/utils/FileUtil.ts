const sizeType = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

export const getFileSize = (fileSize: number) => {
  const sizeIndex = Math.floor(Math.log(fileSize) / Math.log(1024));
  return Math.ceil(fileSize / Math.pow(1024, sizeIndex)) + sizeType[sizeIndex];
};
