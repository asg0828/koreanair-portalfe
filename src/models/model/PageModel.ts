export interface PageModel {
  page: number;
  pageSize: number;
  totalPage: number;
  totalCount: number;
}

export interface PageProps {
  onChange?: (pageSize: any) => void;
  page?: PageModel;
}

export const initPage = {
  totalCount: 0,
  totalPage: 0,
  page: 0,
  pageSize: 10,
};

export const pageSizeList = [10, 30, 50, 100];
