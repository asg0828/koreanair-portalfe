import {
  getBoardingHis,
  getCampHis,
  getCosHis,
  getEtktHis,
  getNonMemEtktHis,
  getNonMemPnrHis,
  getPnrHis,
  getProfile,
  getProfileCLevel,
  getSkypass,
  getTmsHis,
  getVocHis,
} from '@/api/CustomerInfoAPI';
import { useQuery } from '@tanstack/react-query';

// Profile 조회
export const useProfile = (searchInfo: any) => {
  return useQuery(['/customerInfo/profile'], () => getProfile(searchInfo), {
    enabled: false,
  });
};

// Profile 조회(C-Level)
export const useProfileCLevel = (searchInfo: any) => {
  return useQuery(['/customerInfo/profileCLvl'], () => getProfileCLevel(searchInfo), { enabled: false, suspense: false });
};

// skypass 조회
export const useSkypass = (skypassMemberNumber: string) => {
  return useQuery(['/customerInfo/skypassNumber'], () => getSkypass(skypassMemberNumber), { enabled: false });
};

{/* Communication Records */}
// TMS 정보 조회
export const useTmsHis = (oneidNo : string) => {
  return useQuery(['/customerInfo/tms'], () => getTmsHis(oneidNo), { enabled: false });
};

// 상담 정보 조회
export const useCosHis = (oneidNo : string) => {
  return useQuery(['/customerInfo/consulting'], () => getCosHis(oneidNo), { enabled: false });
};

// VOC 정보 조회
export const useVocHis = (oneidNo : string) => {
  return useQuery(['/customerInfo/communication-voc'], () => getVocHis(oneidNo), { enabled: false });
};

// 캠페인 정보 조회
export const useCampHis = (oneidNo : string) => {
  return useQuery(['/customerInfo/campaign'], () => getCampHis(oneidNo), { enabled: false });
};
{/* Communication Records */}


{/* MY Trips 회원용 */}
export const usePnrHis = (skypassMemberNumber  : string) => {
  return useQuery(['customerInfo/pnr'], () => getPnrHis(skypassMemberNumber), { enabled: false });
};

export const useEtktHis = (skypassMemberNumber  : string) => {
  return useQuery(['customerInfo/Etkt'], () => getEtktHis(skypassMemberNumber), { enabled: false });
};
{/* MY Trips 회원용 */}

{/* MY Trips 비회원용 */}
export const useNonMemPnrHis = (oneidNo  : string) => {
  return useQuery(['customerInfo/pnr'], () => getNonMemPnrHis(oneidNo), { enabled: false });
};

export const useNonMemEtktHis = (oneidNo  : string) => {
  return useQuery(['customerInfo/Etkt'], () => getNonMemEtktHis(oneidNo), { enabled: false });
};
{/* MY Trips 비회원용 */}

{/* Boarding history  */}
export const useBoardingHis = (oneidNo : string) => {
  return useQuery(['customerInfo/boardingHis'], () => getBoardingHis(oneidNo), { enabled: false });
};
{/* Boarding history  */}



