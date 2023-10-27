import { callApi } from '@utils/ApiUtil';
import { useQuery } from '@tanstack/react-query';
import { ApiRequest } from '@utils/ApiUtil';

export const QUERY_KEY = ['/test'];

const fetcher = ({ service, url, method, params }: ApiRequest) => {
  return callApi({
    service,
    url,
    method,
    params,
  });
};

const useTestQuery = (apiRequest: ApiRequest) => {
  return useQuery(QUERY_KEY, () => fetcher(apiRequest), { refetchOnWindowFocus: false });
};

export default useTestQuery;
