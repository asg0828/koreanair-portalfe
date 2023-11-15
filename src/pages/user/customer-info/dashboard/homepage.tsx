import { useSelector } from 'react-redux';
import { homepageData } from './data';
import { DetailDataComp } from './detailDataComp';

export default function Homepage() {
  const data = useSelector((state) => homepageData);
  return <DetailDataComp init={data} compName={'homepage'}></DetailDataComp>;
}
