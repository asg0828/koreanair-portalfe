import { callApi, Method } from '@utils/ApiUtil';
import { Service } from '@models/common/Service';
import { useQuery } from '@tanstack/react-query';
import { ParamObject } from '@utils/ApiUtil';

export const QUERY_KEY = ['/menu'];

const fetcher = ({ queryParams, bodyParams }: ParamObject) => {
  return callApi({
    service: Service.KAL_BE,
    url: 'menu',
    method: Method.GET,
    params: {
      queryParams,
      bodyParams,
    },
  });
};

const useMenuQuery = (params: ParamObject, options?: Object) => {
  return useQuery(QUERY_KEY, () => fetcher(params), options);
};

export default useMenuQuery;
