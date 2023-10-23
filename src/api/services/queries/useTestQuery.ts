import callApi from '@/api/common/callApi';
import { useQuery } from '@tanstack/react-query';

export const QUERY_KEY = ['/test'];

export interface params {
}

const fetcher = async (params?: params) => await callApi.get('', params);

const useTestQuery = (params?: params, options?: Object) => {
  return useQuery(QUERY_KEY, () => fetcher(params), options);
}

export default useTestQuery;