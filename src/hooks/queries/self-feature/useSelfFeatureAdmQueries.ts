import {
  retrieveColumnsAndComments,
  retrieveMetaTableDetail,
  retrieveMetaTableLists,
  retrieveSchemaList,
  retrieveTableColumns,
  retrieveTableInfo,
} from '@/api/self-feature/SelfFeatureAdminAPI';
import { CustMetaListSrchInfo } from '@/models/selfFeature/FeatureAdmModel';
import { useQuery } from '@tanstack/react-query';

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

export const useTableInfo = (schemaName: string, ifUpdate: string) => {
  return useQuery([`/batchdb/tables/${schemaName}?ifupdate=`], () => retrieveTableInfo(schemaName, ifUpdate), {
    enabled: false,
  });
};

export const useTableColumns = (schemaName: string, tableName: string) => {
  return useQuery([`/batchdb/tables/${schemaName}/${tableName}`], () => retrieveTableColumns(schemaName, tableName), {
    enabled: false,
  });
};
