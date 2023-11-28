import {
  retrieveColumnsAndComments,
  retrieveMetaTableDetail,
  retrieveMetaTableLists,
  retrieveSchemaList,
  updateMetaTable,
} from '@/api/self-feature/SelfFeatureAdminAPI';
import { RowsInfo } from '@/models/components/Table';
import { CustMetaDetailInfo, CustMetaListSrchInfo } from '@/models/selfFeature/FeatureAdmModel';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useColAndCmmtList = () => {
  return useQuery(['/col-and-cmmt/list'], () => retrieveColumnsAndComments());
};

export const useMetaTableList = (params: CustMetaListSrchInfo) => {
  return useQuery(['/meta-table/list'], () => retrieveMetaTableLists(params));
};

export const useSchemaList = () => {
  return useQuery(['/schema/list'], () => retrieveSchemaList());
};

export const useMetaTableDetail = (params: string) => {
  return useQuery([`/meta-table/detail/${params}`], () => retrieveMetaTableDetail(params));
};

export const useUpdateMetaTable = (
  metaTblId: string,
  metaTblLogiNm: string,
  tbCoMetaTbInfo: RowsInfo,
  tbCoMetaTblClmnInfoList: RowsInfo,
  rtmTblYn: string
) => {
  return useMutation([`/metas/tables/${metaTblId}`, tbCoMetaTblClmnInfoList], () =>
    updateMetaTable(metaTblId, metaTblLogiNm, tbCoMetaTbInfo, tbCoMetaTblClmnInfoList, rtmTblYn)
  );
};
