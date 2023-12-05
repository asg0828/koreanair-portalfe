import {
	retreiveMetaColumnIsResolutionInfo,
	retrieveColumnsAndComments,
	retrieveMetaInfo,
	retrieveMetaTableDetail,
	retrieveMetaTableLists,
	retrieveMstrProfInfo,
	retrieveMstrProfList,
	retrieveResolutionKeyList,
	retrieveSchemaList,
	retrieveTableColumns,
	retrieveTableInfo,
} from '@/api/self-feature/SelfFeatureAdminAPI';
import { CustMetaListSrchInfo, MetaColumnIsResolutionInfoSearchProps, MetaInfoSearchProps, MstrProfSearchInfoProps } from '@/models/selfFeature/FeatureAdmModel';
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
// Master Profile 목록 조회
export const useMstrProfList = (searchInfo: MstrProfSearchInfoProps) => {
	return useQuery(['/master-profile/list'], () => retrieveMstrProfList(searchInfo));
}
// Master Profile 상세 조회
export const useMstrProfInfo = (mstrSgmtRuleId: string) => {
	return useQuery(['/master-profile/info', mstrSgmtRuleId], () => retrieveMstrProfInfo(mstrSgmtRuleId));
}
// Master Profile 메타테이블 전체조회 테이블 선택 콤보박스 조회
export const useMetaInfo = (searchInfo: MetaInfoSearchProps) => {
	return useQuery(['/meta/info'], () => retrieveMetaInfo(searchInfo));
}
// Master Profile 선택한 Resolution 룰에 따른 마스터 join key 후보 조회
export const useResolutionKeyList = (rslnRuleId: string) => {
	return useQuery(['/resolution-key/list', ], () => retrieveResolutionKeyList(rslnRuleId));
}
// Master Profile 선택된 메타테이블 id 값으로 메타컬럼테이블조회 meta_tbl_id 에 따라 조회
export const useMetaColumnIsResolutionInfo = (metaTblId: string, searchInfo: MetaColumnIsResolutionInfoSearchProps) => {
	return useQuery(['/meta-column-is-resolution/info', metaTblId], () => retreiveMetaColumnIsResolutionInfo(metaTblId, searchInfo));
}
