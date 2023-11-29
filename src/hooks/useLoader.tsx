import { getCodeListWithOut } from '@/reducers/codeSlice';

export const useFaqLoader = async ({ request, params }: any) => {
  getCodeListWithOut('FAQ_TYPE');
  return true;
};

export const useQnaLoader = async ({ request, params }: any) => {
  getCodeListWithOut('QNA_TYPE');
  getCodeListWithOut('QNA_STAT');
  return true;
};

export const useFeatureLoader = async ({ request, params }: any) => {
  getCodeListWithOut('FEATURE_TYPE');
  return true;
};

export const useDatasetLoader = async ({ request, params }: any) => {
  getCodeListWithOut('DBMS');
  return true;
};
