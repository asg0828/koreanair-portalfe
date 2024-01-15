import {
  getBoardingCnt,
  getCampHis,
  getCosHis,
  getEtktHis,
  getPetCnt,
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


{/* MY Trips */}
export const usePnrHis = (skypassMemberNumber  : string) => {
  return useQuery(['customerInfo/pnr'], () => getPnrHis(skypassMemberNumber), { enabled: false });
};

export const useEtktHis = (skypassMemberNumber  : string) => {
  return useQuery(['customerInfo/Etkt'], () => getEtktHis(skypassMemberNumber), { enabled: false });
};
{/* MY Trips */}


export const useBoardingCnt = (oneidNo : string) => {
  return useQuery(['customerInfo/boardingCnt'], () => getBoardingCnt(oneidNo), { enabled: false });
};

export const usePetCnt = (oneidNo : string) => {
  return useQuery(['customerInfo/petCnt'], () => getPetCnt(oneidNo), { enabled: false });
};
