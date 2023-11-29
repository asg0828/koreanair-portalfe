import { createMetaTableInfo, deleteMetaTable, updateMetaTable } from '@/api/self-feature/SelfFeatureAdminAPI';
import {
  approveSubmissionApproval,
  cancelRequestSubmission,
  createCustFeatRule,
  deleteCustFeatRule,
  insertSubmissionRequest,
  rejectSubmissionApproval,
  updateCustFeatRule,
} from '@/api/self-feature/SelfFeatureUserAPI';
import { RowsInfo } from '@/models/components/Table';
import { QueryParams } from '@/utils/ApiUtil';
import { useMutation } from '@tanstack/react-query';

// customer feature 등록 (Rule-Design)
export const useCreateCustFeatRule = (bodyParams: Object) => {
  return useMutation(() => createCustFeatRule(bodyParams));
};
// customer feature 수정 (Rule-Design)
export const useUpdateCustFeatRule = (custFeatRuleId: string, bodyParams: Object) => {
  return useMutation(() => updateCustFeatRule(custFeatRuleId, bodyParams));
};
// customer feature 삭제
export const useDeleteCustFeatRule = (qParams: QueryParams) => {
  return useMutation(() => deleteCustFeatRule(qParams));
};
// customer feature 승인 요청
export const useInsertSubmissionRequest = (email: string, submissionId: number) => {
  return useMutation(() => insertSubmissionRequest(email, submissionId));
};
// customer feature 승인 요청 취소
export const useCancelRequestSubmission = (email: string, submissionId: number) => {
  return useMutation(() => cancelRequestSubmission(email, submissionId));
};
// customer feature 승인 처리
export const useApproveSubmissionApproval = (email: string, approvalId: number, bodyParams: Object) => {
  return useMutation(() => approveSubmissionApproval(email, approvalId, bodyParams));
};
// customer feature 반려 처리
export const useRejectSubmissionApproval = (email: string, approvalId: number, bodyParams: Object) => {
  return useMutation(() => rejectSubmissionApproval(email, approvalId, bodyParams));
};
// customer Meta 등록
export const useCreateMetaTableInfo = () => {
  return useMutation([`/metas/tables/create`], () => createMetaTableInfo());
};
// customer Meta 수정
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
// customer Meta 삭제
export const useDeleteMetaTable = (metaTblIds: Array<string>) => {
  return useMutation([`/metas/tables/delete`], () => deleteMetaTable(metaTblIds));
};
