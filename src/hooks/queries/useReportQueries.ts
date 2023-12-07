import { ReportParams } from '@/models/model/ReportModel';
import { useQuery } from '@tanstack/react-query';
import {getReportVipList} from "@api/ReportAPI";

export const useVipList = (params: ReportParams) => {
    return useQuery(['/report/vip'], () => getReportVipList(params));
};
