import { retrieveCommCodes } from "@/api/self-feature/SelfFeatureCmmAPI"
import { useQuery } from "@tanstack/react-query"

export const useCommCodes = (params: string) => {
    return useQuery([`/common-code/${params}`], () => retrieveCommCodes(params))
}