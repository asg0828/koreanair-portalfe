import { getCodeList as fetchCodeList } from '@/api/CodeAPI';
import { CodeInfo } from '@/models/common/Code';
import { codeSlice } from '@/reducers';
import { reduxStore } from '@/index';

const useLoader = () => {
  const codeList = reduxStore.getState().code.codeList;
  const dispatch = reduxStore.dispatch;

  const getCodeListAsync = async (groupId: string): Promise<Array<CodeInfo>> => {
    const filterCodeList = codeList.filter((codeItem) => codeItem.groupId === groupId);

    if (filterCodeList.length === 0) {
      let codeList: Array<CodeInfo> = [];

      await fetchCodeList(groupId)
        .then((response) => {
          if (response.successOrNot === 'N') {
          } else {
            codeList = response.data;
            dispatch(codeSlice.actions.addCodeList(codeList));
          }
        })
        .catch((error) => {});

      return codeList;
    }

    return filterCodeList;
  };

  return {
    getCodeListAsync,
  };
};

export const useFaqLoader = async ({ request, params }: any) => {
  const { getCodeListAsync } = useLoader();

  return await getCodeListAsync('FAQ_TYPE');
};

export const useQnaLoader = async ({ request, params }: any) => {
  const { getCodeListAsync } = useLoader();
  const response1 = getCodeListAsync('QNA_TYPE');
  const response2 = getCodeListAsync('QNA_STAT');

  return await Promise.all([response1, response2]);
};

export default useLoader;
