import { 
    retrieveColumnsAndComments,
    retrieveMetaTableLists, 
    retrieveSchemaList, 
} from '@/api/SelfFeatureAdminAPI'
import { CmSrchInfo } from '@/pages/admin/self-feature-meta-management/customer-meta-management'
import { useQuery } from '@tanstack/react-query'

export const useColAndCmmtList = () => {
    return useQuery(['/col-and-cmmt/list'], () => retrieveColumnsAndComments())
}

export const useMetaTableList = (params: CmSrchInfo) => {
    return useQuery(['/meta-table/list'], () => retrieveMetaTableLists(params))
}

export const useSchemaList = () => {
    return useQuery(['/schema/list'], () => retrieveSchemaList())
}