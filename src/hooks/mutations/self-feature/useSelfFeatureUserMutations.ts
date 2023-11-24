import { createCustFeatRule } from '@/api/self-feature/SelfFeatureUserAPI';
import { useMutation } from '@tanstack/react-query'

export const useCreateCustFeatRule = (bodyParams: Object) => {
    return useMutation(['/customer-feature-fule/create', bodyParams], () => createCustFeatRule(bodyParams));
}