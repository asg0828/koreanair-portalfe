import { useSelector } from 'react-redux';
import { homepageData } from './data';
import { DetailData } from './detailDataComp';

export default function Homepage() {
  const data = useSelector((state) => homepageData);
  return <DetailData init={data} compName={'homepage'}></DetailData>;
}
