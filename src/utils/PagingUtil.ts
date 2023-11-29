import { PageModel } from '@/models/model/PageModel';

export const getAddedRownum = (page: PageModel) => {
  return page.page * page.pageSize + 1;
};

export const getTotalPage = (length: number, pageSize: number) => {
  return Math.ceil(length / pageSize);
};
