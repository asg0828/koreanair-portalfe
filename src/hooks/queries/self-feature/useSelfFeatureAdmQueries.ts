import {
  retrieveColumnsAndComments,
  retrieveMetaTableDetail,
  retrieveMetaTableLists,
  retrieveSchemaList,
} from '@/api/self-feature/SelfFeatureAdminAPI';
import { CustMetaListSrchInfo } from '@/models/selfFeature/FeatureAdmModel';
import { useQuery } from '@tanstack/react-query';

export const useColAndCmmtList = () => {
  return useQuery(['/col-and-cmmt/list'], () => retrieveColumnsAndComments());
};

export const useMetaTableList = (params: CustMetaListSrchInfo) => {
  return useQuery(['/meta-table/list'], () => retrieveMetaTableLists(params));
};

export const useSchemaList = (schemaName: string, ifUpdate: string) => {
  return useQuery(['/schema/list'], () => retrieveSchemaList(schemaName, ifUpdate));
};

export const useMetaTableDetail = (params: string) => {
  return useQuery([`/meta-table/detail/${params}`], () => retrieveMetaTableDetail(params));
};
