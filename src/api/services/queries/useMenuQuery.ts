import callApi from '@/api/common/callApi';
import { useQuery } from '@tanstack/react-query';

export const QUERY_KEY = ['/menu'];

const fetcher = async () => await callApi.get('/menu');

const useMenuQuery = () => {
  return useQuery(QUERY_KEY, fetcher);
}

export default useMenuQuery;