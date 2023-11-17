import { getFeatureTypList } from '@/api/FeatureAPI';
import { getCodeListWithOut } from '@/reducers/codeSlice';

export const useFaqLoader = async ({ request, params }: any) => {
  return await getCodeListWithOut('FAQ_TYPE');
};

export const useQnaLoader = async ({ request, params }: any) => {
  const response1 = getCodeListWithOut('QNA_TYPE');
  const response2 = getCodeListWithOut('QNA_STAT');
  return await Promise.all([response1, response2]);
};

export const useFeatureLoader = async ({ request, params }: any) => {
  const response1 = getCodeListWithOut('FEATURE_TYPE');
  const response2 = getFeatureTypList();
  const response = await Promise.all([response1, response2]);

  return response[1].data;
};
