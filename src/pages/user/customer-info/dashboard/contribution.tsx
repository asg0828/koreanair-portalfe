import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { contributeData } from './data';
import { DetailData } from './detailDataComp';
import { callApi, Method, ParamObject, QueryParams } from '@utils/ApiUtil';
import { Service } from '@models/common/Service';
export default function Contribution(props: any) {
  const data = useSelector((state) => contributeData);
  const skypassNum = props.skypassNum;
  const oneId = props.oneId;
  const passengerNm = props.passengerNm;
  useEffect(() => {
    // 공통 코드 API CALL && 초기 LIST 조회 API CALL
    retrievecontribution({});
  }, []);

  // api 호출

  const retrievecontribution = (queryParams: QueryParams) => {
    return callApi({
      service: Service.KAL_BE,
      url: '',
      method: Method.GET,
    });
  };
  return <DetailData init={data} compName={'contribution'}></DetailData>;
}
