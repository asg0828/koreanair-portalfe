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
import {
	CustMetaListSrchInfo,
	MetaColumnIsResolutionInfoSearchProps,
	MetaInfoSearchProps,
	MstrProfSearchInfoProps,
} from '@/models/selfFeature/FeatureAdmModel';
import { useQuery } from '@tanstack/react-query';

// 메타 테이블 컬럼 및 코멘트 조회 (retrieveColumnsAndComments)
export const useColAndCmmtList = (tableName: string) => {
	return useQuery(['/col-and-cmmt/list'], () => retrieveColumnsAndComments(tableName));
};

// 메타 테이블 id로 조회 (retrieveMetaTableById)
export const useMetaTableList = (params: CustMetaListSrchInfo) => {
	return useQuery(['/meta-table/list'], () => retrieveMetaTableLists(params));
};

// 스키마 조회 (retrieveSchema)
export const useSchemaList = () => {
	return useQuery(['/schema/list'], () => retrieveSchemaList());
};

// 메타 테이블 목록 조회 (retrieveMetaTableLists)
export const useMetaTableDetail = (params: string) => {
	return useQuery([`/meta-table/detail/${params}`], () => retrieveMetaTableDetail(params));
};

// 테이블 조회 (retrieveTableInfo)
export const useTableInfo = (schemaName: string, ifUpdate: string) => {
	return useQuery([`/batchdb/tables/${schemaName}?ifupdate=`], () => retrieveTableInfo(schemaName, ifUpdate), {
		enabled: false,
	});
};

// 테이블 컬럼 조회 (retrieveTableColumns)
export const useTableColumns = (schemaName: string, tableName: string) => {
	return useQuery([`/batchdb/tables/${schemaName}/${tableName}`], () => retrieveTableColumns(schemaName, tableName), {
		enabled: false,
	});
};

// Master Profile 목록 조회
export const useMstrProfList = (searchInfo: MstrProfSearchInfoProps) => {
	return useQuery(['/master-profile/list'], () => retrieveMstrProfList(searchInfo))
}
// Master Profile 상세 조회
export const useMstrProfInfo = (mstrSgmtRuleId: string) => {
	return useQuery(['/master-profile/info', mstrSgmtRuleId], () => retrieveMstrProfInfo(mstrSgmtRuleId), { enabled: false })
}
// Master Profile 메타테이블 전체조회 테이블 선택 콤보박스 조회
export const useMetaInfo = (searchInfo: MetaInfoSearchProps) => {
	return useQuery(['/meta/info'], () => retrieveMetaInfo(searchInfo), { enabled: false })
}
// Master Profile 선택한 Resolution 룰에 따른 마스터 join key 후보 조회
export const useResolutionKeyList = (rslnRuleId: string) => {
	return useQuery(['/resolution-key/list'], () => retrieveResolutionKeyList(rslnRuleId), { enabled: false })
}
// Master Profile 선택된 메타테이블 id 값으로 메타컬럼테이블조회 meta_tbl_id 에 따라 조회
export const useMetaColumnIsResolutionInfo = (metaTblId: string, searchInfo: MetaColumnIsResolutionInfoSearchProps) => {
	return useQuery(['/meta-column-is-resolution/info', metaTblId], () =>
		retreiveMetaColumnIsResolutionInfo(metaTblId, searchInfo), { enabled: false, suspense: false }
	)
}
// Master Profile 선택된 메타테이블 id 값으로 메타컬럼테이블조회 meta_tbl_id 에 따라 조회(속성 조인키 조회)
export const useMetaColumnIsResolutionJoinkeyInfo = (metaTblId: string, searchInfo: MetaColumnIsResolutionInfoSearchProps) => {
	return useQuery(['/meta-column-is-resolution/info-joinkey', metaTblId], () =>
		retreiveMetaColumnIsResolutionInfo(metaTblId, searchInfo), { enabled: false, suspense: false }
	)
}
