import { useSelector } from 'react-redux';
import { contributeData } from './data';
import DetailData from './detailDataComp';

export default function Contribution() {
  const data = useSelector((state) => contributeData);
  return <DetailData init={data} compName={'contribution'}></DetailData>;
}
