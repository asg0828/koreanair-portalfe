import { ReducerType } from '@/reducers';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

const useCode = () => {
  const codeList = useSelector((state: ReducerType) => state.code.codeList);

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
