import {
  cancelRequestSubmission,
  createCustFeatRule,
  deleteCustFeatRule,
  insertSubmissionRequest,
  updateCustFeatRule,
} from '@/api/self-feature/SelfFeatureUserAPI';
<<<<<<< HEAD
<<<<<<< HEAD
import { QueryParams } from '@/utils/OAuthApiUtil';
import { useMutation } from '@tanstack/react-query';
=======
=======
>>>>>>> f484408 (fix: self-feature mutation queryParams 참조 수정)
import { QueryParams } from '@/utils/ApiUtil';
import { useMutation } from '@tanstack/react-query'

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
