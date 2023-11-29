import dayjs from 'dayjs'

export const getDateString = (timestamp: number | string, separator: string = '') => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  return `${year}${separator}${month}${separator}${day}`;
};
// <ex> 2022-12-01T10:30:25+09:00
export const getDateFormatType1 = (time: string) => {
  return dayjs(time).format().toString()
}
// <ex> 2022-12-01
export const getDateFormatType2 = (time: string) => {
  return dayjs(time).format("YYYY-MM-DD").toString()
}
// <ex> 2022-12-01 10:30:25
export const getDateFormatType3 = (time: string) => {
  return dayjs(time).format("YYYY-MM-DD HH:mm:ss").toString()
}