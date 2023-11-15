import { useSelector } from 'react-redux';
import { contributeData } from './data';
import { DetailDataComp } from './detailDataComp';

export default function Contribution(props: any) {
  const data = useSelector((state) => contributeData);

  return <DetailDataComp init={data} compName={'contribution'}></DetailDataComp>;
}
