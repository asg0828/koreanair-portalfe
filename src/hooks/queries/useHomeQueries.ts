import { getBizMeta, getFeatureMyDept, getLoginInfo, getLoginUserDept } from '@/api/HomeAPI';
import { useQuery } from '@tanstack/react-query';

export const useBizMeta = () => {
  return useQuery(['/home/biz-meta-count'], getBizMeta, { suspense: false });
};

export const useFeatureMyDept = (userId: string) => {
  return useQuery(['/home/login-user-dept'], () => getFeatureMyDept(userId), { suspense: false });
};

export const useLoginInfo = (userId: string) => {
  return useQuery(['/home/login-info'], () => getLoginInfo(userId), { suspense: false });
};

export const useLoginUserDept = () => {
  return useQuery(['/home/login-user-dept'], getLoginUserDept, { suspense: false });
};
