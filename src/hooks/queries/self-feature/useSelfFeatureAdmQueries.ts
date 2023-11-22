import { 
    retrieveColumnsAndComments,
    retrieveMetaTableLists, 
    retrieveSchemaList, 
} from '@/api/self-feature/SelfFeatureAdminAPI'
import { CustMetaListSrchInfo } from '@/models/selfFeature/FeatureAdmModel'
import { useQuery } from '@tanstack/react-query'

export const useColAndCmmtList = () => {
    return useQuery(['/col-and-cmmt/list'], () => retrieveColumnsAndComments())
}

export const useMetaTableList = (params: CustMetaListSrchInfo) => {
    return useQuery(['/meta-table/list'], () => retrieveMetaTableLists(params))
}

export const useSchemaList = () => {
    return useQuery(['/schema/list'], () => retrieveSchemaList())
}