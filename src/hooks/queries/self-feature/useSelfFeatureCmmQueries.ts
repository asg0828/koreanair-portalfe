import { retrieveCommCodes } from "@/api/self-feature/SelfFeatureCmmAPI"
import { useQuery } from "@tanstack/react-query"

export const useCommCodes = (params: string) => {
    return useQuery([`/common-code/${params}`], () => retrieveCommCodes(params))
}
// 2024-01-15 공통코드 호출 API 중복으로 인한 제거
// export const useAuthCommCodes = (params: string) => {
//     return useQuery([`/common-code-auth/${params}`], () => retrieveAuthCommCodes(params))
// }