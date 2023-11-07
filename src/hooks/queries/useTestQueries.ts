import { callApi, ApiRequest } from '@utils/ApiUtil';
import { useQuery } from '@tanstack/react-query';

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
  return useQuery(QUERY_KEY, () => fetcher(apiRequest));
};

export default useTestQuery;
