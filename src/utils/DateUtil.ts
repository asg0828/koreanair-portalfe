export const getDateString = (timestamp: number | string, separator: string = '') => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  return `${year}${separator}${month}${separator}${day}`;
};
