import { ReportParams } from '@/models/model/ReportModel';
import { useQuery } from '@tanstack/react-query';
import {getPurchaseContributionList, getReportVipList} from "@api/ReportAPI";

export const useVipList = (params: ReportParams) => {
    return useQuery(['/report/vip'], () => getReportVipList(params));
};

export const usePurchaseContributionList = (criteria: string) => {
    return useQuery(['/report/purchase-contribution', criteria], () => getPurchaseContributionList(criteria));
};

