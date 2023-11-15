import { useSelector } from 'react-redux';
import { analysisResultData } from './data';
import { DetailDataComp } from './detailDataComp';

export default function AnalysisResult() {
  const data = useSelector((state) => analysisResultData);

  return <DetailDataComp init={data} compName={'analysisResult'}></DetailDataComp>;
}
