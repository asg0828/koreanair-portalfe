import CloseIcon from '@mui/icons-material/Close';
import { Button, Modal, Select, Stack, Typography, useToast, SelectOption, TR, TD, THead, TH, Table, Label } from '@components/ui';
import { useEffect, useState } from 'react';
import { SelectValue } from '@mui/base/useSelect';
import Watermark from '@uiw/react-watermark';
import { useAppSelector } from '@/hooks/useRedux';
import { selectSessionInfo } from '@/reducers/authSlice';
import NoResult from '@/components/emptyState/NoData';
import { useBoardingHis, useCampHis, useCosHis, useEtktHis, useEtl, useNonMemEtktHis, useNonMemPnrHis, usePnrHis, useProfile, useSkypass, useTmsHis, useVocHis } from '@/hooks/queries/useCustomerInfoQueires';
import { familyColumn, initCampaign, initConsulting, initFamily, initProfile, initSkypass, initTms, initVoc, initEtl } from '@/pages/user/customer-info/dashboard/data';
import { useTranslation } from 'react-i18next';
import {
  Profile,
  Skypass,
  Pnr,
  Etkt,
  Voc,
  FamilyMembers,
  Campaign,
  Consulting,
  Tms,
  Boarding,
  Etl,
  EtktList,
  PnrList,
  NonMemEtkt,
  NonMemEtktList,
  NonMemPnrList,
} from '@/models/model/CustomerInfoModel';
import { ValidType } from '@/models/common/Constants';
import { cloneDeep } from 'lodash'

export default function DashBoardPopUp({ oneIdNo }: any) {
  const sessionInfo = useAppSelector(selectSessionInfo())
  const { toast } = useToast();
  // My trips(예약, E-TKT) 항목
  const [isListView1, setIsListView1] = useState({ open: false, contents: '' });
  // Boarding history 항목
  const [isListView2, setIsListView2] = useState(false);
  // communication records(상담, 캠페인, VOC, TMS) 항목
  const [isListView3, setIsListView3] = useState({ open: false, contents: '' });
  const [selectedSkypass, setSelectedSkypass] = useState<Skypass>(initSkypass);
  const today = new Date();
  const yesterday = new Date(today.setDate(today.getDate() - 1));
  const batchDate = `${yesterday.getFullYear()}-${(`0` + (yesterday.getMonth() + 1)).slice(-2)}-${(`0` + yesterday.getDate()).slice(-2)}`;
  const [profile, setProfile] = useState<Profile>(initProfile);
  const [skypass, setSkypass] = useState<Array<Skypass>>([]);
  const [family, setFamily] = useState<Array<FamilyMembers>>([]);
  const [pnr, setPnr] = useState<Array<PnrList>>([]);
  const [pnrCnt, setPnrCnt] = useState(0)
  const [pnrNonMem, setPnrNonMem] = useState<Array<NonMemPnrList>>([])
  const [etkt, setEtkt] = useState<Array<EtktList>>([]);
  const [etktCnt, setEtktCnt] = useState(0)     
  const [etktNonMem, setEtktNonMem] = useState<Array<NonMemEtktList>>([])
  const [boarding, setBoarding] = useState<Array<Boarding>>([]);
  const [campaign, setCampaign] = useState<Campaign>(initCampaign);
  const [consulting, setConsulting] = useState<Consulting>(initConsulting);
  const [tms, setTms] = useState<Tms>(initTms)
  const [voc, setVoc] = useState<Voc>(initVoc);
  const [etl, setEtl] = useState<Etl>(initEtl)
  const [searchInfo, setSearchInfo] = useState<any>({ oneidNo: oneIdNo, searchType: 'A' });
  /* 로딩바 */
  const { t } = useTranslation()
  // skypass 조회용 변수 
  const [searchSkypassNm, setSearchSkypassNm] = useState('')
  // profile 조회 api
  const { refetch: refetchProfile, data: responseProfile, isError: isErrorProfile } = useProfile(searchInfo);
  // skypass 조회 api
  const { refetch: refetchSkypass, data: responseSkypass, isError: isErrorSkypass} = useSkypass(searchSkypassNm);
  // 캠페인 조회 api
  const { refetch: refetchCamp, data: responseCamp, isError: isErrorCamp } = useCampHis(searchInfo.oneidNo);
  // 상담 정보 조회 api
  const { refetch: refetchCos, data: responseCos, isError: isErrorCos } = useCosHis(searchInfo.oneidNo)
  // TMS 정보 조회 api
  const { refetch: refetchTms, data: responseTms, isError: isErrorTms } = useTmsHis(searchInfo.oneidNo)
  // Voc 정보 조회 api
  const { refetch: refetchVoc, data: responseVoc, isError: isErrorVoc } = useVocHis(searchInfo.oneidNo)
  // pnr 정보 조회 api
  const { refetch: refetchPnr, data: responsePnr, isError: isErrorPnr } = usePnrHis(searchSkypassNm)
  // ticket 정보 조회 api
  const { refetch: refetchEtkt, data: responseEtkt, isError: isErrorEtkt } = useEtktHis(searchSkypassNm)
  // etl 조회 api
  const {refetch: refetchEtl, data: responseEtl, isError: isErrorEtl  } = useEtl()
  // 비회원 ticket 정보 조회 api
  const { refetch: refetchNonMemEtkt, data: responseNonMemEtkt, isError: isErrorNonMemEtkt } = useNonMemEtktHis(searchInfo.oneidNo)
  // 비회원 pnr 정보 조회 api
  const { refetch: refetchNonMemPnr, data: responseNonMemPnr, isError: isErrorNonMemPnr } = useNonMemPnrHis(searchInfo.oneidNo)
  // 탑승 이력 조회 api
  const { refetch: refetchBoarding, data: responseBoarding, isError: isErrorBoarding } = useBoardingHis(searchInfo.oneidNo)
  

  const [key, setKey] = useState(Date.now());

  // 등록가족 상세 버튼 모달 state
  const [isOpenFamilyInfo, setOpenFamilyInfo] = useState(false);
  // 마일리지 상세 버튼 모달 state
  const [openMileDtl, setOpenMileDtl] = useState(false)
  
  // 등록가족 상세 모달 오픈 버튼
  const retrieveFamilyInfo = () => {
    setOpenFamilyInfo(true);
  };

  // 스카이패스 마일리지 모달 오픈 버튼
  const retrieveMileDtl = () => {
    setOpenMileDtl(true)
  }

  /* select 입력 함수 */
  const onchangeSelectHandler = (
    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
    value: SelectValue<{}, false>,
    id?: string
  ) => {
    setSearchSkypassNm(String(value))
  };

  useEffect(() => {
    if(searchInfo.searchType !== '' && searchInfo.oneidNo !== ''){
      refetchProfile();
      setKey(Date.now());
      refetchCamp()
      refetchCos()
      refetchTms()
      refetchVoc()
      refetchBoarding()
      setSearchInfo({...searchInfo, searchType: ''})
    }
  }, [searchInfo])

  useEffect(() => { 
    if(searchSkypassNm !== '') {
      refetchSkypass()
      refetchPnr()
      refetchEtkt()
      setKey(Date.now());
    }
  }, [searchSkypassNm])

// 월 영문 변환 함수 
function convertMonthToAbbreviation(dateString : string) {
  const monthAbbreviations: { [key: string]: string } = {
    '01': 'JAN',
    '02': 'FEB',
    '03': 'MAR',
    '04': 'APR',
    '05': 'MAY',
    '06': 'JUN',
    '07': 'JUL',
    '08': 'AUG',
    '09': 'SEP',
    '10': 'OCT',
    '11': 'NOV',
    '12': 'DEC'
  };

  const month = dateString.substring(2, 4);
  const monthAbbreviation = monthAbbreviations[month];
  if (monthAbbreviation) {
    return dateString.replace(month, monthAbbreviation);
  } else {
    return dateString;
  }
}

// 가족 관계 변환 함수 
const convertFamilyRelation = (familyGroupCode : string) => {
  const code: {[key: string]: string}  = {
    '00': 'Member',
    '03': 'Grandparent', 
    '51': 'Maternal Grandparent',
    '05': 'Parent', 
    '07': 'Parent of Spouse',
    '10': 'Spouse', 
    '20': 'Brother/ Sister', 
    '30': 'Child', 
    '35': 'Grandchild', 
    '40': 'Daughter/ Son-in-Law',
    '60': 'Child of Daughter' 
  }
  const relationship = code[familyGroupCode];;

  if(relationship){
    return relationship
  } else {
    return familyGroupCode
  }
}

 // 프로필 조회
 useEffect(() => {
  if (isErrorProfile || responseProfile?.successOrNot === 'N') {
    // toast({
    //   type: ValidType.ERROR,
    //   content: responseProfile?.message,
    // });
    setProfile(initProfile)
    setSkypass([])
    setFamily([])
  } else {
    if (responseProfile) {
      setProfile(responseProfile?.data);
      // 회원 비회원 분기 
      if(responseProfile?.data?.skypassInfos?.length > 0){
        setSearchSkypassNm(responseProfile?.data.skypassInfos[0]?.skypassMemberNumber)
        // setCampaign(initCampaign)
        // setConsulting(initConsulting)
        // setTms(initTms)
        // setVoc(initVoc)
        // setFamily(initFamily)
        // setSelectedSkypass(initSkypass)
        // setSkypass([])
        // setBoarding([]) 
      } else{
        // 비회원 조회
        refetchEtl()
        refetchNonMemEtkt()
        refetchNonMemPnr()
      }
    }
  }
}, [responseProfile, isErrorProfile, key]);

  // skypass 조회
  useEffect(() => {
    if (isErrorSkypass || responseSkypass?.successOrNot === 'N') {
      setSelectedSkypass(initSkypass)
      setFamily(initFamily)
      toast({
        type: ValidType.ERROR,
        content: responseSkypass?.message,
      });
    } else {
      if (responseSkypass) {
        setSelectedSkypass(responseSkypass.data)
        setFamily(responseSkypass.data.familyMembers)
      }
    }
  }, [isErrorSkypass, responseSkypass, key]);
 // 캠페인 조회
 useEffect(() => {
  if (isErrorCamp || responseCamp?.successOrNot === 'N') {
    // toast({
    //   type: ValidType.ERROR,
    //   content: responseCamp?.message,
    // });
  } else {
    if (responseCamp) {
      setCampaign(responseCamp.data)
    }
  }
}, [responseCamp, isErrorCamp, key]);

// 상담 조회
useEffect(() => {
  if (isErrorCos || responseCos?.successOrNot === 'N') {
    // toast({
    //   type: ValidType.ERROR,
    //   content: responseCos?.message,
    // });
  } else {
    if (responseCos) {
      setConsulting(responseCos.data)
    }
  }
}, [responseCos, isErrorCos, key]);

// tms 조회
useEffect(() => {
  if (isErrorTms || responseTms?.successOrNot === 'N') {
    // toast({
    //   type: ValidType.ERROR,
    //   content: responseTms?.message,
    // });
  } else {
    if (responseTms) {
      setTms(responseTms.data)
    }
  }
}, [responseTms, isErrorTms, key]);

// voc 조회
useEffect(() => {
  if (isErrorVoc || responseVoc?.successOrNot === 'N') {
    // toast({
    //   type: ValidType.ERROR,
    //   content: responseVoc?.message,
    // });
  } else {
    if (responseVoc) {
      setVoc(responseVoc.data)
    }
  }
}, [responseVoc, isErrorVoc, key]);

// pnr 조회
useEffect(() => {
  if (isErrorPnr || responsePnr?.successOrNot === 'N') {
    // toast({
    //   type: ValidType.ERROR,
    //   content: responsePnr?.message,
    // });
  } else {
    if (responsePnr) {
      const groupedData: { [key: string]: any } = {};
      for (const item of responsePnr.data) {
        const key = item.reservationNumber;
        if (!groupedData[key]) {
          groupedData[key] = [];
        }
        groupedData[key].push({
          "surname": item.surname,
          "givenname": item.givenname,
          "segNumber": item.segNumber,
          "companyIdentification": item.companyIdentification,
          "productIdentification": item.productIdentification,
          "classOfService": item.classOfService,
          "departureDate": convertMonthToAbbreviation(item.departureDate),
          "boardPointCityCode": item.boardPointCityCode,
          "offPointCityCode": item.offPointCityCode,
          "bookingStatus": item.bookingStatus
        });
      }

      const result = Object.entries(groupedData).map(([key, value]) => {
        return {
          "reservationNumber": key,
          "pnrList": value
        };
      });
      setPnr(result)
      setPnrCnt(responsePnr.data.length)
    }
  }
}, [responsePnr, isErrorPnr, key]);

// eticket 조회
useEffect(() => {
  if (isErrorEtkt || responseEtkt?.successOrNot === 'N') {
    // toast({
    //   type: ValidType.ERROR,
    //   content: responseEtkt?.message,
    // });
  } else {
    if (responseEtkt) {
      const groupedData: { [key: string]: any } = {};
      for (const item of responseEtkt.data) {
        const key = item.ticketNumber;
        if (!groupedData[key]) {
          groupedData[key] = [];
        }
        groupedData[key].push({
          "flightNumber": item.flightNumber,
          "bookingClass": item.bookingClass,
          "marketingCompany": item.marketingCompany,
          "departureDate": convertMonthToAbbreviation(item.departureDate),
          "cpnNumber": item.cpnNumber,
          "boardPointLocationId": item.boardPointLocationId,
          "offPointLocationId": item.offPointLocationId
        });
      }

      const result = Object.entries(groupedData).map(([key, value]) => {
        return {
          "ticketNumber": key,
          "etktList": value
        };
      });
      setEtkt(result)
      setEtktCnt(responseEtkt.data.length)
    }
  }
}, [responseEtkt, isErrorEtkt, key]);

// boarding 조회
useEffect(() => {
  if (isErrorBoarding || responseBoarding?.successOrNot === 'N') {
    // toast({
    //   type: ValidType.ERROR,
    //   content: responseBoarding?.message,
    // });
  } else {
    if (responseBoarding) {
      setBoarding(responseBoarding.data)
    }
  }
}, [responseBoarding, isErrorBoarding, key]);


// 배치 기준 시간 (Etl) 조회
useEffect(() => {
  if (isErrorEtl || responseEtl?.successOrNot === 'N') {
    // toast({
    //   type: ValidType.ERROR,
    //   content: responseEtl?.message,
    // });
  } else {
    if (responseEtl) {
      setEtl(responseEtl.data)
    }
  }
}, [responseEtl, isErrorEtl]);

// 비회원 Etkt 조회
useEffect(() => {
  if (isErrorNonMemEtkt || responseNonMemEtkt?.successOrNot === 'N') {
    // toast({
    //   type: ValidType.ERROR,
    //   content: responseNonMemEtkt?.message,
    // });
  } else {
    if (responseNonMemEtkt) {

      const groupedData: { [key: string]: any } = {};
      for (const item of responseNonMemEtkt.data) {
        const key = item.ticketNumber;
        if (!groupedData[key]) {
          groupedData[key] = [];
        }
        groupedData[key].push({
          'oneidNo': item.oneidNo,
          'flightNumber': item.flightNumber,
          'bookingClassCode': item.bookingClassCode,
          'bkgDtBsStdDatev': item.bkgDtBsStdDatev,
          'pnrSegNumber': item.pnrSegNumber,
          'segApo': item.segApo,
        });
      }

      const result = Object.entries(groupedData).map(([key, value]) => {
        return {
          "ticketNumber": key,
          "etktList": value
        };
      });

      setEtktCnt(responseNonMemEtkt.data.length)
      setEtktNonMem(result)
    }
  }
}, [responseNonMemEtkt, isErrorNonMemEtkt]);

// 비회원 Pnr 조회
useEffect(() => {
  if (isErrorNonMemPnr || responseNonMemPnr?.successOrNot === 'N') {
    // toast({
    //   type: ValidType.ERROR,
    //   content: responseNonMemPnr?.message,
    // });
  } else {
    if (responseNonMemPnr) {
      const groupedData: { [key: string]: any } = {};
      for (const item of responseNonMemPnr.data) {
        const key = item.pnrNo;
        if (!groupedData[key]) {
          groupedData[key] = [];
        }
        groupedData[key].push({
          'pnrNo': item.pnrNo,
          'engLname': item.engLname,
          'engFname': item.engFname,
          'oneidNo': item.oneidNo,
          'flightNumber': item.flightNumber,
          'bookingClassCode': item.bookingClassCode,
          'bkgDtBsStdDatev': item.bkgDtBsStdDatev,
          'pnrSegNumber': item.pnrSegNumber,
          'segApo': item.segApo,
          'reservationStatusCode': item.reservationStatusCode,
        });
      }

      const result = Object.entries(groupedData).map(([key, value]) => {
        return {
          "pnrNo": key,
          "pnrList": value
        };
      });
      setPnrNonMem(result)
      setPnrCnt(responseNonMemPnr.data.length)
    }
  }
}, [responseNonMemPnr, isErrorNonMemPnr]);

// useEffect(() => {
//   reset()
// }, [])

// const reset = () => {
//   setProfile((state: Profile) => {
//     let rtn = cloneDeep(state)
//     rtn = cloneDeep(initProfile)
//     return rtn
//   })
//   setSkypass((prevState) => {
//     return cloneDeep([])
//   })
//   setFamily((prevState) => {
//     return cloneDeep([])	
//   })
//   setSelectedSkypass((state: Skypass) => {
//     let rtn = cloneDeep(state)
//     rtn = cloneDeep(initSkypass)
//     return rtn
//   })
//   setPnr((prevState)=> {
//     return cloneDeep([])
//   })
//   setBoarding((prevState)=> {
//     return cloneDeep([])
//   })
//   setEtkt((prevState)=> {
//     return cloneDeep([])
//   })
//   setPnrNonMem((prevState)=> {
//     return cloneDeep([])
//   })
//   setEtktNonMem((prevState)=> {
//     return cloneDeep([])
//   })
//   // setSearchInfo({ skypassMemberNumber: '', oneidNo: '', searchType: '' })
//   setSearchSkypassNm('')
//   setCampaign(initCampaign)
//   setConsulting(initConsulting)
//   setTms(initTms)
//   setVoc(initVoc)
//   // setEtl(initEtl)
//   setPnrCnt(0)
//   setEtktCnt(0)
// }

return (
  <Stack direction="Vertical" justifyContent="Start" className={'width-100'} wrap={true}>
    <div className="dashBoardWrap">
      <Stack direction="Vertical">
        <Stack>
          <Typography variant="h3" className="dashboardTitle">
            Customer Info.
          </Typography>
        </Stack>
        <div style={{ position: 'relative' }} className="topCard">
          <h5
            style={{
              fontWeight: '400',
              position: 'absolute',
              left: 250,
              top: 10,
              color: 'white',
            }}
          >
            {batchDate} 기준
          </h5>
          <div className="dashBoardBox n1">
            <div className="name">
                {profile?.korLname}{profile?.korFname}
              <span className="en">
                {profile?.engLname}
                &nbsp;
                {profile?.engFname}
              </span>
            </div>
            <div className="profile">
              <div className="top">
                Profile
                <div className="kr">프로파일</div>
              </div>
              <div className="item">
                <div className="key">생년월일</div>
                <div className="value">{profile?.birthDatev.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}</div>
              </div>
              <div className="item">
                <div className="key">만나이</div>
                <div className="value">{profile?.age}</div>
              </div>
              <div className="item">
                <div className="key">성별</div>
                <div className="value">{profile?.sexCode}</div>
              </div>

              <div className="item">
                <div className="key">휴대폰번호</div>
                <div className="value">
                  { profile?.mobilePhoneNumber }
                </div>
              </div>
              <div className="item">
                <div className="key">이메일</div>
                {profile?.emailAddress && (
                  <div className="value">{`*****@${profile?.emailAddress.split('@')[1]}`}</div>
                )}
              </div>
              <div className="item">
                <div className="key">특이사항</div>
                {/* <div className="value">{profile?.}</div> */}
                {/* 특이사항 컬럼 필요 (ex. VIP) */}
              </div>
            </div>
          </div>
          <div className="dashBoardBox n2">
            <div className="top" style={{ position: 'relative' }}>
              SKYPASS
              <div className="kr">스카이패스</div>
              {profile.skypassInfos && profile.skypassInfos.length > 1 && (
                <Select
                  id="searchSkypassNm"
                  defaultValue={profile.skypassInfos.length > 1 ? profile.skypassInfos[0].skypassMemberNumber : ''}
                  appearance="Outline"
                  placeholder="스카이패스선택"
                  style={{ maxHeight: '80%', position: 'absolute', right: 0, fontSize: '80%', bottom: 2 }}
                  value={searchSkypassNm}
                  onChange={(
                    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                    value: SelectValue<{}, false>
                  ) => {
                    onchangeSelectHandler(e, value);
                  }}
                >
                  {profile.skypassInfos.map((item: any, index: number) => (
                    <SelectOption key={index} value={item.skypassMemberNumber} style={{ maxHeight: '70%', fontSize: '13px' }}>
                      {item.skypassMemberNumber}
                    </SelectOption>
                  ))}
                </Select>
              )}
            </div>
            <div className="item">
              <div className="key">회원번호</div>
              <div className="value">{selectedSkypass?.skypassMemberNumber}</div>
            </div>
            <div className="item">
              <div className="key">회원등급</div>
              <div className="value">{selectedSkypass?.memberLevel}</div>
            </div>
            <div className="item">
              <div className="key">휴면여부</div>
              <div className="value">{selectedSkypass?.memberStatusNm}</div>
            </div>
            <div className="item">
              <div className="key">현등급최초시작일</div>
              <div className="value">{selectedSkypass?.effectiveFrom.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}</div>
            </div>
            <div className="item">
              <div className="key">적립 마일리지</div>
              <div className="value">{selectedSkypass?.totalAccrued}</div>
            </div>
            <div className="item">
              <div className="key">사용 마일리지</div>
              <div className="value">{selectedSkypass?.totalRedeemed}</div>
            </div>
            <div className="item">
              <div className="key">잔여 마일리지</div>
              <div className="value">{selectedSkypass?.remainMileage} <Button style={{ float: 'right'}} onClick={retrieveMileDtl}>상세</Button></div>
            </div>
            <div className="item">
              <div className="key">PLCC 카드보유</div>{
                selectedSkypass?.skypassMemberNumber !== '' && (
                  <div className="value">{selectedSkypass?.isPlccCard ? 'Y' : 'N'}</div>
                )
              }
            </div>
          </div>
          <Modal size={70} open={openMileDtl} onClose={() => setOpenMileDtl(false)}>
            <Modal.Header>잔여 마일리지 상세</Modal.Header>
            <Modal.Body>
              <Label>
                {t('common.label.countingUnit.total')}
                <span className="total">{` ${selectedSkypass.expiredMileages.length} `}</span>
                {t('common.label.countingUnit.thing')}
              </Label>
              <Table variant="vertical" size="normal" align="center" className={`verticalTable`}>
                <div className="verticalTableDiv">
                <THead className='verticalTableDivHeader'>
                  <TR>
                    <TH>
                      유효기간
                    </TH>
                    <TH>
                      마일리지
                    </TH>
                  </TR>
                </THead>
                {selectedSkypass.expiredMileages.length > 0 ? (selectedSkypass.expiredMileages.filter((item) => item.remainMileage !== 0).map((list) =>(
                  <TR>
                    <TD className='verticalTableTD'>{list.expiration.length === 4 ? list.expiration.replace(/(\d{2})(\d{2})/, '20$1-$2') : '평생'}</TD>
                    <TD className='verticalTableTD'>{list.remainMileage}</TD>
                  </TR>
                ))) : (<NoResult/>)} 
                </div>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button
                priority="Primary"
                appearance="Contained"
                onClick={() => {
                  setOpenMileDtl(false);
                }}
              >
                확인
              </Button>
            </Modal.Footer>
          </Modal>
          <div style={{ position: 'relative' }} className="dashBoardBox n3">
            <h5 style={{ fontWeight: '400', position: 'absolute', right: 30, top: 10, color: 'gray' }}>
              {batchDate} 기준
            </h5>

            <div className="top" style={{ position: 'relative' }}>
              Family Member
              <div className="kr">가족</div>
              <Button
                priority="Normal"
                appearance="Contained"
                style={{ position: 'absolute', right: 0, maxHeight: '80%', fontSize: '80%', bottom: 2 }}
                onClick={retrieveFamilyInfo}
              >
                등록가족 상세
              </Button>
              <Modal size={70} open={isOpenFamilyInfo} onClose={() => setOpenFamilyInfo(false)}>
                <Modal.Header>등록가족 상세</Modal.Header>
                <Modal.Body>
                  <Label>
                    {t('common.label.countingUnit.total')}
                    <span className="total">{` ${family.length} `}</span>
                    {t('common.label.countingUnit.thing')}
                  </Label>
                  <Table variant="vertical" size="normal" align="center" className={`verticalTable`}>
                    <div className="verticalTableDiv">
                    <THead className='verticalTableDivHeader'>
                      <TR>
                      {familyColumn.map((column, index) => (
                        <TH 
                          key={`header-${index}`}
                          colSpan={column.colSpan ? column.colSpan : undefined}>
                            {column.headerName}
                          </TH>
                      ))}
                      </TR>
                    </THead>
                    {family.length > 0 ?  (family?.map((list) =>(
                      <TR>
                        <TD className='verticalTableTD'>{list?.familyGroupCode && convertFamilyRelation(list?.familyGroupCode)}</TD>
                        <TD className='verticalTableTD'>{list.korFName}{list.korGName}</TD>
                        <TD className='verticalTableTD'>{list.engFName} {list.engGName}</TD>
                        <TD className='verticalTableTD'>{list.memberStatus}</TD>
                        <TD className='verticalTableTD'>{list.dateOfBirth?.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}</TD>
                        <TD className='verticalTableTD'>{list.skypassNumber}</TD>
                        <TD className='verticalTableTD'>{list.memberStatusNm}</TD>
                        <TD className='verticalTableTD'>{list.createdDate?.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}</TD>
                      </TR>
                      ))) : (<NoResult/>)} 
                    </div>
                  </Table>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    priority="Primary"
                    appearance="Contained"
                    onClick={() => {
                      setOpenFamilyInfo(false);
                    }}
                  >
                    확인
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
            <div className="middle">
              <div className="left">
                등록<br/>가족
                <span className="num">{family[0]?.skypassNumber !== '' ? family.length : 0}</span>명
              </div>
              <div className="right">
                합산가능<br/>마일리지
                <span className="num">
                  {family.filter((list) => list.familyGroupCode !== '00').map((a)=> a.currentMileage).reduce(function add(sum, curVal) { return sum + curVal }, 0)}
                </span>
              </div>
            </div>
            <div className="list" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              <table>
                <colgroup>
                  <col width="30%" />
                  <col width="30%" />
                  <col width="40%" />
                </colgroup>
                <thead>
                  <th>Relationship</th>
                  <th>Code</th>
                  <th>Name</th>
                </thead>
                <tbody>
                  {family &&
                    family.length > 0 &&
                    family?.map((list: any) => (
                      <tr>
                        <td>{list?.familyGroupCode && convertFamilyRelation(list?.familyGroupCode)}</td>
                        <td>{list.skypassNumber}</td>
                        <td>{list.engFName} &nbsp;{list.engGName}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Typography variant="h3" className="dashboardTitle">
          Customer Reference.
        </Typography>
        <Stack className="width-100" gap="LG" alignItems="Start">
          <div style={{ position: 'relative' }} className="dashBoardBox under width-50">
            <h5 style={{ fontWeight: '400', position: 'absolute', right: 20, top: 10, color: 'gray' }}>
              { ( searchInfo.oneidNo !== '' && searchSkypassNm === '') ? `${etl?.mytrips.slice(0, 10)}` : `${batchDate}` }기준
            </h5>
            <div className="top">
              MY Trips
              <div className="kr">여행</div>
            </div>
            <div className="itemWrap">
              <div className="item middle">
                <Stack justifyContent="Between">
                  <div className="key">
                    <button
                      onClick={() => {
                        setIsListView1({ open: true, contents: 'pnr' });
                      }}
                    >
                      예약
                    </button>
                  </div>
                  <div className="value">
                    <span className="num">{pnrCnt}</span>개
                  </div>
                </Stack>
              </div>
              <div className="item middle">
                <Stack justifyContent="Between" alignItems={'cencter'}>
                  <div className="key">
                    <button
                      onClick={() => {
                        setIsListView1({ open: true, contents: 'etkt' });
                      }}
                    >
                      E-TKT
                    </button>
                  </div>
                  <div className="value">
                    <span className="num">{etktCnt}</span>개
                  </div>
                </Stack>
              </div>
            </div>
            {isListView1.open && isListView1.contents === 'pnr' && (
              <div className="hideContents">
                {pnr.length > 0 && pnr.map((list) => (
                <>
                  <table>
                    <colgroup>
                      <col width="auto" />
                    </colgroup>
                    <thead>
                      <th>예약번호</th>
                      {/* <th>영문이름</th> */}
                    </thead>
                    <tbody>
                      <tr>
                        <td>{list?.reservationNumber}</td>
                        {/* <td> {list.givenname && (list.givenname.endsWith("MR") || list.givenname.endsWith("MS"))
                          ? list.givenname.substring(0, list.givenname.length - 2) : list.givenname}{list.surname}
                        </td> */}
                      </tr>
                    </tbody>
                  </table>
                  <table>
                    <colgroup>
                      <col width="auto" />
                    </colgroup>
                    <thead>
                      <th>편명</th>
                      <th>BKG CLS</th>
                      <th>출발일</th>
                      <th>구간</th>
                      <th>예약상태</th>
                    </thead>
                    <tbody>
                      {list?.pnrList?.map((item) => (
                        <tr>
                          <td>{item?.companyIdentification}{item?.productIdentification?.toString().padStart(4, '0')}</td>
                          <td>{item?.classOfService}</td>
                          <td>{item?.departureDate}</td>
                          <td>{item?.boardPointCityCode}{item?.offPointCityCode}</td>
                          <td>{item?.bookingStatus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <br/>
                </>
                )
                )}
                 {pnrNonMem.length > 0 && pnrNonMem.map((list) => (
                <>
                  <table>
                    <colgroup>
                      <col width="auto" />
                    </colgroup>
                    <thead>
                      <th>예약번호</th>
                      {/* <th>영문이름</th> */}
                    </thead>
                    <tbody>
                      <tr>
                        <td>{list?.pnrNo}</td>
                        {/* <td>{list?.engLname}{list?.engFname}</td> */}
                      </tr>
                    </tbody>
                  </table>
                  <table>
                    <colgroup>
                      <col width="auto" />
                    </colgroup>
                    <thead>
                      <th>편명</th>
                      <th>BKG CLS</th>
                      <th>출발일</th>
                      <th>구간</th>
                      <th>예약상태</th>
                    </thead>
                    <tbody>
                      {list?.pnrList?.map((item) => (
                        <tr>
                          <td>{item?.flightNumber}</td>
                          <td>{item?.bookingClassCode}</td>
                          <td>{item?.bkgDtBsStdDatev}</td>
                          <td>{item?.segApo}</td>
                          <td>{item?.reservationStatusCode}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <br/>
                </>
                )
                )}
              </div>
            )}
            {isListView1.open && isListView1.contents === 'etkt' && (
              <div className="hideContents">
                {etkt.length > 0 && etkt.map((list) => (
                  <>
                    <table>
                      <colgroup>
                        <col width="auto" />
                      </colgroup>
                      <thead>
                        <th>티켓번호</th>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{list?.ticketNumber}</td>
                        </tr>
                      </tbody>
                    </table>
                    <table>
                      <colgroup>
                        <col width="auto" />
                      </colgroup>
                      <thead>
                        <th>편명</th>
                        <th>BKG CLS</th>
                        <th>출발일</th>
                        <th>순서</th>
                        <th>구간</th>
                      </thead>
                      <tbody>
                        {list?.etktList?.map((item) => (
                          <tr>
                            <td>{item?.marketingCompany}{item?.flightNumber.toString().padStart(4, '0')}</td>
                            <td>{item?.bookingClass}</td>
                            <td>{item?.departureDate}</td>
                            <td>{item?.cpnNumber}</td>
                            <td>{item?.boardPointLocationId}{item?.offPointLocationId}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <br/>
                  </>
                ))}
                {etktNonMem.length > 0 && etktNonMem.map((list) => (
                  <>
                    <table>
                      <colgroup>
                        <col width="auto" />
                      </colgroup>
                      <thead>
                        <th>티켓번호</th>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{list?.ticketNumber}</td>
                        </tr>
                      </tbody>
                    </table>
                    <table>
                      <colgroup>
                        <col width="auto" />
                      </colgroup>
                      <thead>
                        <th>편명</th>
                        <th>BKG CLS</th>
                        <th>출발일</th>
                        <th>순서</th>
                        <th>구간</th>
                      </thead>
                      <tbody>
                        {list?.etktList?.map((item) => (
                          <tr>
                            <td>{item?.flightNumber}</td>
                            <td>{item?.bookingClassCode}</td>
                            <td>{item?.bkgDtBsStdDatev}</td>
                            <td>{item?.pnrSegNumber}</td>
                            <td>{item?.segApo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <br/>
                  </>
                ))}
              </div>
            )}
            <button
              type="button"
              className={'viewMore ' + (isListView1.open ? 'true' : 'false')}
              onClick={(event) => {
                if (isListView1.contents === '') {
                  setIsListView1({ open: !isListView1.open, contents: 'pnr' });
                } else {
                  setIsListView1({ open: !isListView1.open, contents: '' });
                }
              }}
            >
              {isListView1.open ? '숨기기' : '더보기'}
            </button>
          </div>
          <Stack className="width-50" gap="LG">
            <div style={{ position: 'relative' }} className="dashBoardBox under width-50">
              <h5 style={{ fontWeight: '400', position: 'absolute', right: 20, top: 10, color: 'gray' }}>
              { ( searchInfo.oneIdno !== '' && searchSkypassNm === '') ? `${etl?.wallet.slice(0, 10)}` : `${batchDate}` }기준
              </h5>
              <div className="top">
                Wallet
                <div className="kr">지갑</div>
              </div>
              <div className="itemWrap">
                <div className="item large">
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">보유쿠폰</div>
                    <div className="value">
                      <span className="num">{profile?.holdEcpnCnt + profile?.holdTktDiscCpnCnt + profile?.holdTktDiscountPlccCpnCnt}</span>개
                    </div>
                  </Stack>
                </div>
              </div>
              <div className="item middle">
                <Stack justifyContent="Between" alignItems={'cencter'}>
                  <div className="key">유효 promotion coupon</div>
                  <div className="value">
                    <span className="num">{profile?.holdTktDiscCpnCnt}</span>
                  </div>
                </Stack>
              </div>
              <div className="item middle">
                <Stack justifyContent="Between" alignItems={'cencter'}>
                  <div className="key">전자우대할인권</div>
                  <div className="value">
                    <span className="num">{profile?.holdEcpnCnt}</span>
                  </div>
                </Stack>
              </div>
              <div className="item middle">
                <Stack justifyContent="Between" alignItems={'cencter'}>
                  <div className="key">카드사 쿠폰</div>
                  <div className="value">
                    <span className="num">{profile?.holdTktDiscountPlccCpnCnt}</span>
                  </div>
                </Stack>
              </div>
            </div>
            <div style={{ position: 'relative' }} className="dashBoardBox under width-50">
              <h5 style={{ fontWeight: '400', position: 'absolute', right: 20, top: 10, color: 'gray' }}>
              { ( searchInfo.oneIdno !== '' && searchSkypassNm === '') ? `${etl?.preference.slice(0, 10)}` : `${batchDate}` }기준
              </h5>
              <div className="top">
                Preference
                <div className="kr">선호도</div>
              </div>
              <div className="item middle">
                <Stack justifyContent="Between" alignItems={'cencter'}>
                  <div className="key">최다 탑승 좌석</div>
                  <div className="value">{profile?.intMostSetaType}</div>
                </Stack>
              </div>
              <div className="item middle">
                <Stack justifyContent="Between" alignItems={'cencter'}>
                  <div className="key">선호 기내식</div>
                  <div className="value">{profile?.hiclsMenuPrefer}</div>
                </Stack>
              </div>
              <div className="item middle">
                <Stack justifyContent="Between" alignItems={'cencter'}>
                  <div className="key">골프여행 선호지수</div>
                  <div className="value">{profile?.golfTrvlPrspFeatureValue}</div>
                </Stack>
              </div>
              <div className="item middle">
                <Stack justifyContent="Between" alignItems={'cencter'}>
                  <div className="key">High Class 선호지수</div>
                  <div className="value">{profile?.prfrPrspFeatureValue}</div>
                </Stack>
              </div>
            </div>
          </Stack>
        </Stack>
        <Typography variant="h3" className="dashboardTitle">
          Customer History.
        </Typography>
        <Stack className="width-100" gap="LG" alignItems="Start">
          <div style={{ position: 'relative' }} className="dashBoardBox under width-50">
            <h5 style={{ fontWeight: '400', position: 'absolute', right: 20, top: 10, color: 'gray' }}>
            { ( searchInfo.oneIdno !== '' && searchSkypassNm === '') ? `${etl?.boarding.slice(0, 10)}` : `${batchDate}` }기준
            </h5>
            <div className="top">
              Boarding history
              <div className="kr">탑승 이력</div>
            </div>
            <div className="itemWrap">
              <div className="item middle">
                <Stack justifyContent="Between">
                  <div className="key">
                    <button
                      onClick={() => {
                        setIsListView2(true);
                      }}
                    >
                      탑승횟수
                    </button>
                  </div>
                  <div className="value">
                    <span className="num">{profile?.boardCnt}</span>회
                  </div>
                </Stack>
              </div>
            </div>
            {isListView2 && (
              <div className="hideContents">
                <table>
                  <colgroup>
                    <col width="25%" />
                    <col width="15%" />
                    <col width="20%" />
                    <col width="15%" />
                    <col width="25%" />
                  </colgroup>
                  <thead>
                    <th>탑승일</th>
                    <th>편명</th>
                    <th>구간</th>
                    <th>CBN CLS</th>
                    <th>티켓번호</th>
                  </thead>
                  <tbody>
                    {boarding.map((item, index) => (
                      <tr>
                        <td>{item?.localTimeBaseStdDatev}</td>
                        <td>{item?.flightNumber}</td>
                        <td>{item?.segApo}</td>
                        <td>{item?.cabinClassCode}</td>
                        <td>{item?.ticketNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <button
              type="button"
              className={'viewMore ' + (isListView2 ? 'true' : 'false')}
              onClick={() => {
                setIsListView2(!isListView2);
              }}
            >
              {isListView2 ? '숨기기' : '더보기'}
            </button>
          </div>
          <div style={{ position: 'relative' }} className="dashBoardBox under width-50">
            <h5 style={{ fontWeight: '400', position: 'absolute', right: 20, top: 10, color: 'gray' }}>
            { ( searchInfo.oneIdno !== '' && searchSkypassNm === '') ? `${etl?.communication.slice(0, 10)}` : `${batchDate}` }기준
            </h5>
            <div className="top">communication records</div>
            <div className="itemWrap">
              <Stack justifyContent="Between" gap="LG">
                <div className="item middle" style={{ flex: '1' }}>
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">
                      <button
                        onClick={() => {
                          setIsListView3({ open: true, contents: 'consulting' });
                        }}
                      >
                        상담
                      </button>
                    </div>
                    <div className="value">
                      <span className="num">{profile?.talkUseCnt}</span>
                    </div>
                  </Stack>
                </div>
                <div className="item middle" style={{ flex: '1' }}>
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">
                      <button
                        onClick={() => {
                          setIsListView3({ open: true, contents: 'campaign' });
                        }}
                      >
                        캠페인
                      </button>
                    </div>
                    <div className="value">
                      <span className="num">{profile?.campaignSendCnt}</span>
                    </div>
                  </Stack>
                </div>
              </Stack>
              <Stack justifyContent="Between" gap="LG">
                <div className="item middle" style={{ flex: '1' }}>
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">
                      <button
                        onClick={() => {
                          setIsListView3({ open: true, contents: 'voc' });
                        }}
                      >
                        VOC
                      </button>
                    </div>
                    <div className="value">
                      <span className="num">{profile?.vocCnt}</span>
                    </div>
                  </Stack>
                </div>
                <div className="item middle" style={{ flex: '1' }}>
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">
                      <button
                        onClick={() => {
                          setIsListView3({ open: true, contents: 'tms' });
                        }}
                      >
                        TMS
                      </button>
                    </div>
                    <div className="value">
                      <span className="num">{profile?.tmsSendCnt}</span>
                    </div>
                  </Stack>
                </div>
              </Stack>
            </div>
            {isListView3.open && isListView3.contents === 'consulting' && (
              <div className="hideContents">
                <table className="centerTable">
                <colgroup>
                    <col width="50%" />
                    <col width="50%" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>상담 채널</th>
                      <th>최근 상담일</th>
                    </tr>
                  </thead>
                  <tbody>
                      <tr>
                        <td>서비스 센터</td>
                        <td>{consulting?.lastServiceCenterUseDatev?.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}</td>
                      </tr>
                      <tr>
                        <td>챗봇</td>
                        <td>{consulting?.lastChatbotTalkDatev?.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}</td>
                      </tr>
                      <tr>
                        <td>채팅</td>
                        <td>{consulting?.lastChatTalkDatev?.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}</td>
                      </tr>
                  </tbody>
                </table>
              </div>
            )}
            {isListView3.open && isListView3.contents === 'campaign' && (
              <div className="hideContents">
                <table className="centerTable">
                <colgroup>
                    <col width="50%" />
                    <col width="50%" />
                  </colgroup>
                  <thead>
                    <tr className="width-100">
                      <th>캠페인 채널</th>
                      <th>최근 발송일</th>
                    </tr>
                  </thead>
                  <tbody>
                      <tr>
                        <td>카카오알림톡</td>
                        <td>{campaign?.lastCmpgnKakaotalkSndDtim.slice(0, 10)}</td>
                      </tr>
                      <tr>
                        <td>SMS/LMS</td>
                        <td>{campaign?.lastCmpgnKakaotalkSndDtim.slice(0, 10)}</td>
                      </tr>
                      <tr>
                        <td>APP PUSH</td>
                        <td>{campaign?.lastCampaignApshSndDtim.slice(0, 10)}</td>
                      </tr>
                      <tr>
                        <td>E-MAIL</td>
                        <td>{campaign?.lastCampaignEmailSendDtim.slice(0, 10)}</td>
                      </tr>
                  </tbody>
                </table>
              </div>
            )}
            {isListView3.open && isListView3.contents === 'voc' && (
              <div className="hideContents">
                <table className="centerTable">
                <colgroup>
                    <col width="50%" />
                    <col width="50%" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>VOC 유형</th>
                      <th>최근 VOC 접수일</th>
                    </tr>
                  </thead>
                  <tbody>
                      <tr>
                        <td>불만</td>
                        <td>{voc?.vocComplainLastRctDatev?.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}</td>
                      </tr>
                      <tr>
                        <td>제언</td>
                        <td>{voc?.vocSuggestLastRctDatev?.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}</td>
                      </tr>
                      <tr>
                        <td>Disruption</td>
                        <td>{voc?.vocDisruptionLastRctDatev?.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}</td>
                      </tr>
                  </tbody>
                </table>
              </div>
            )}
          
            {isListView3.open && isListView3.contents === 'tms' && (
              <div className="hideContents">
                <table className="centerTable">
                  <colgroup>
                    <col width="50%" />
                    <col width="50%" />
                  </colgroup>
                  <thead>
                    <tr className="width-100">
                      <th>TMS 발송 채널</th>
                      <th>최근 발송일</th>
                    </tr>
                  </thead>
                  <tbody>
                      <tr>
                        <td>카카오알림톡</td>
                        <td>{tms?.lastTmsKakaoTalkSendDtim.slice(0, 10)}</td>
                      </tr>
                      <tr>
                        <td>SMS/LMS</td>
                        <td>{tms?.lastTmsSmsSendDatetime.slice(0, 10)}</td>
                      </tr>
                      <tr>
                        <td>APP PUSH</td>
                        <td>{tms?.lastTmsAppPushSendDtim.slice(0, 10)}</td>
                      </tr>
                      <tr>
                        <td>E-MAIL</td>
                        <td>{tms?.lastTmsEmailSendDatetime.slice(0, 10)}</td>
                      </tr>
                  </tbody>
                </table>
              </div>
            )}
            <button
              type="button"
              className={'viewMore ' + (isListView3.open ? 'true' : 'false')}
              onClick={(event) => {
                if (isListView3.contents === '') {
                  setIsListView3({ open: !isListView3.open, contents: 'consulting' });
                } else {
                  setIsListView3({ open: !isListView3.open, contents: isListView3.contents });
                }
              }}
            >
              {isListView3.open ? '숨기기' : '더보기'}
            </button>
          </div>
        </Stack>
      </Stack>
    </div>
  </Stack>
);
}


