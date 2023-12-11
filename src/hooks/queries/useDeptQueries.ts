import { getDeptAllList } from '@/api/DeptAPI';
import { useQuery } from '@tanstack/react-query';

export const useDeptAllList = () => {
  return useQuery(['/dept/list'], () => getDeptAllList(), { suspense: false });
};
