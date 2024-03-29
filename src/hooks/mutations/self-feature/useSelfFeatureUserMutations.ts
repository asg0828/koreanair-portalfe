import {
  approveSubmissionApproval,
  cancelRequestSubmission,
  createCustFeatRule,
  createCustFeatSQL,
  deleteCustFeatRule,
  insertSubmissionRequest,
  rejectSubmissionApproval,
  runScheduleByManually,
  updateCustFeatRule,
  updateCustFeatSQL,
  updateFeatureCategory,
} from '@/api/self-feature/SelfFeatureUserAPI'
import { QueryParams } from '@/utils/ApiUtil'
import { useMutation } from '@tanstack/react-query'

// customer feature 등록 (Rule-Design)
export const useCreateCustFeatRule = (bodyParams: Object) => {
  return useMutation(() => createCustFeatRule(bodyParams))
}
// customer feature 수정 (Rule-Design)
export const useUpdateCustFeatRule = (custFeatRuleId: string, bodyParams: Object) => {
  return useMutation(() => updateCustFeatRule(custFeatRuleId, bodyParams))
}
// customer feature 등록 (SQL)
export const useCreateCustFeatSQL = (bodyParams: Object) => {
  return useMutation(() => createCustFeatSQL(bodyParams))
}
// customer feature 수정 (SQL)
export const useUpdateCustFeatSQL = (custFeatRuleId: string, bodyParams: Object) => {
  return useMutation(() => updateCustFeatSQL(custFeatRuleId, bodyParams))
}
// customer feature 삭제
export const useDeleteCustFeatRule = (qParams: QueryParams) => {
  return useMutation(() => deleteCustFeatRule(qParams))
}
// customer feature 승인 요청
export const useInsertSubmissionRequest = (email: string, submissionId: number) => {
  return useMutation(() => insertSubmissionRequest(email, submissionId))
}
// customer feature 승인 요청 취소
export const useCancelRequestSubmission = (email: string, submissionId: number) => {
  return useMutation(() => cancelRequestSubmission(email, submissionId))
}
// customer feature 승인 처리
export const useApproveSubmissionApproval = (email: string, approvalId: number, bodyParams: Object) => {
  return useMutation(() => approveSubmissionApproval(email, approvalId, bodyParams))
}
// customer feature 반려 처리runScheduleByManually
export const useRejectSubmissionApproval = (email: string, approvalId: number, bodyParams: Object) => {
  return useMutation(() => rejectSubmissionApproval(email, approvalId, bodyParams))
}
// customer feature 수동 실행
export const useRunScheduleByManually = (custFeatRuleId: string) => {
  return useMutation(() => runScheduleByManually(custFeatRuleId))
}
// Self-feature 카테고리 설정
export const useFeatureCategory = (custFeatRuleId: string, bodyParams: Object) => {
  return useMutation(() => updateFeatureCategory(custFeatRuleId, bodyParams))
}
