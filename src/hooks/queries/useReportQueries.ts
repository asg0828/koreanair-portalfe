import {
  getBonusTicketTop100List,
  getDomesticBoardingTop100List,
  getIntlBoardingTop100List, getIntlUpgradeTop100List,
  getPurchaseContributionTop100List,
  getReportVipList,
  getTotalMileageTop100List,
} from '@api/ReportAPI';
import { PageModel } from '@models/model/PageModel';
import { useQuery } from '@tanstack/react-query';

export const useVipList = (page: PageModel, sortedColumn: string, sortedDirection: string = '') => {
  return useQuery(['/report/vip'], () => getReportVipList(page, sortedColumn, sortedDirection));
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

export const useBonusTicketTop100List = () => {
  return useQuery(['/report/award-ticket-boarding'], () => getBonusTicketTop100List());
};

export const useIntlUpgradeTop100List = () => {
  return useQuery(['/report/intl-mileage-upgrade-boarding'], () => getIntlUpgradeTop100List());
};
