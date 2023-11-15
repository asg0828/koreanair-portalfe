import { useAppSelector } from '@/hooks/useRedux';
import { useCallback } from 'react';

const useCode = () => {
  const codeList = useAppSelector((state) => state.code.codeList);

  const getCodeList = useCallback(
    (groupId: string) => {
      return codeList.filter((codeItem) => codeItem.groupId === groupId);
    },
    [codeList]
  );

  const getCode = useCallback(
    (groupId: string, codeId: string) => {
      return codeList.find((codeItem) => codeItem.groupId === groupId && codeItem.codeId === codeId);
    },
    [codeList]
  );

  return {
    getCodeList,
    getCode,
  };
};

export default useCode;
