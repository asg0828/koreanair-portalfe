import callApi from '@/api/common/callApi';
import { useQuery } from '@tanstack/react-query';

export const QUERY_KEY = ['/test'];

const fetcher = async () => await callApi.get('/notice');

const useNoticeQuery = () => {
  return useQuery(QUERY_KEY, fetcher, { suspense: false });
}

export default useNoticeQuery;