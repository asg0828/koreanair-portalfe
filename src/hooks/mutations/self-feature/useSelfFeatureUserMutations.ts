import { 
    cancelRequestSubmission,
    createCustFeatRule, 
    deleteCustFeatRule, 
    insertSubmissionRequest, 
    updateCustFeatRule,
} from '@/api/self-feature/SelfFeatureUserAPI';
import { QueryParams } from '@/utils/OAuthApiUtil';
import { useMutation } from '@tanstack/react-query'

// customer feature 등록 (Rule-Design)
export const useCreateCustFeatRule = (bodyParams: Object) => {
    return useMutation(['/customer-feature-Rule/create', bodyParams], () => createCustFeatRule(bodyParams));
}
// customer feature 수정 (Rule-Design)
export const useUpdateCustFeatRule = (custFeatRuleId: string, bodyParams: Object) => {
    return useMutation(['/customer-feature-Rule/update', bodyParams], () => updateCustFeatRule(custFeatRuleId, bodyParams));
}
// customer feature 삭제
export const useDeleteCustFeatRule = (qParams: QueryParams) => {
    return useMutation(['/customer-feature-Rule/delete'], () => deleteCustFeatRule(qParams))
}
// customer feature 승인 요청
export const useInsertSubmissionRequest = (email: string, submissionId: number) => {
    return useMutation(['/customer-feature-Rule/request-submisson/request'], () => insertSubmissionRequest(email, submissionId))
}
// customer feature 승인 요청 취소
export const useCancelRequestSubmission = (email: string, submissionId: number) => {
    return useMutation(['/customer-feature-Rule/request-submisson/cancel'], () => cancelRequestSubmission(email, submissionId))
}