import { ReportParams } from '@/models/model/ReportModel';
import { useQuery } from '@tanstack/react-query';
import {
    getDomesticBoardingTop100List,
    getIntlBoardingTop100List,
    getPurchaseContributionTop100List,
    getReportVipList, getTotalMileageTop100List
} from "@api/ReportAPI";

export const useVipList = (params: ReportParams) => {
    return useQuery(['/report/vip'], () => getReportVipList(params));
};

export const usePurchaseContributionList = (criteria: string) => {
    return useQuery(['/report/purchase-contribution', criteria], () => getPurchaseContributionTop100List(criteria));
};

export const useIntlBoardingTop100List = (criteria: string) => {
    return useQuery(['/report/intl-boarding', criteria], () => getIntlBoardingTop100List(criteria));
};

export const useDomesticBoardingTop100List = (criteria: string) => {
    return useQuery(['/report/domestic-boarding', criteria], () => getDomesticBoardingTop100List(criteria));
};

export const useTotalMileageTop100List = (criteria: string) => {
    return useQuery(['/report/total-mileage', criteria], () => getTotalMileageTop100List(criteria));
};

