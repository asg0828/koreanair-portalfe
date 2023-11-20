import { getCustomerInfo } from '@/api/CustomerInfoAPI';
import { useQuery } from '@tanstack/react-query';

// CDP-360
export const useCustomerInfo = (searchInfo: any) => {
  return useQuery(['/customerInfo'], () => getCustomerInfo(searchInfo), { enabled: false });
};
