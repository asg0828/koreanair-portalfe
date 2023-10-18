import { useSelector } from 'react-redux';
import { analysisResultData } from './data';
import DetailData from './detailDataComp';

export default function AnalysisResult() {
  const data = useSelector((state) => analysisResultData);

  return <DetailData init={data} compName={'analysisResult'}></DetailData>;
}
