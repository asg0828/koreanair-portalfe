import { PageModel } from '@/models/model/PageModel';

export const getStartRownum = (page: PageModel) => {
  return page.page * page.pageSize + 1;
};

export const getTotalPage = (length: number, pageSize: number) => {
  return Math.ceil(length / pageSize);
};

export const getPagingList = (list: Array<any>, page: PageModel): Array<any> => {
  const startRownum = getStartRownum(page);
  const filterList = list.slice(startRownum - 1, startRownum - 1 + page.pageSize);
  return filterList.map((item: any, index: number) => ({
    ...item,
    rownum: index + startRownum,
  }));
};
