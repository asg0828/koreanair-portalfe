import dayjs from 'dayjs'

export enum DateUnitType {
  DAY = 'day',
  WEEK = 'week',
  QUARTER = 'quarter',
  MONTH = 'month',
  YEAR = 'year',
  HOUR = 'hour',
  MINUTE = 'minute',
  SECOND = 'second',
  MILLISECOND = 'millisecond',
}

export const getDateString = (timestamp: number | string, separator: string = '') => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  return `${year}${separator}${month}${separator}${day}`;
};

export const getDateFormat = (time: string, format?: string) => {
  if (!format || format === "") return dayjs(time).format().toString()
  else return dayjs(time).format(format).toString()
}

export const getDateDiff = (stTime: string, edTime: string, units?: DateUnitType) => {
  const st = dayjs(stTime)
  const ed = dayjs(edTime)
  if (!units) return ed.diff(st).toString()
  else return ed.diff(st, units).toString()
}