import { PageModel } from '@/models/model/PageModel';

export const PagingUtil = (data: any, page: PageModel) => {
  page.totalCount = data.length;
  page.totalPage = data.length / page.pageSize; // 여기에 page.pageSize가 들어와야되는데
  return page;
};
