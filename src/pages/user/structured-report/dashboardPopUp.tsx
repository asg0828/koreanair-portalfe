import CloseIcon from '@mui/icons-material/Close';
import { Button, Modal, Select, Stack, Typography, useToast, SelectOption, TR, TD, THead, TH, Table, Label } from '@components/ui';
import { useEffect, useState } from 'react';
import { SelectValue } from '@mui/base/useSelect';
import Watermark from '@uiw/react-watermark';
import { useAppSelector } from '@/hooks/useRedux';
import { selectSessionInfo } from '@/reducers/authSlice';
import NoResult from '@/components/emptyState/NoData';
import { useProfile, useSkypass } from '@/hooks/queries/useCustomerInfoQueires';
import { familyColumn,  initFamily,  initProfile, initSkypass } from '@/pages/user/customer-info/dashboard/data';
import { useTranslation } from 'react-i18next';
import {
  Profile,
  Skypass,
  Wallet,
  Preference,
  Cnt,
  Pnr,
  Etkt,
  BoardingList,
  Voc,
  Sms,
  Sns,
  Email,
  FamilyMembers,
} from '@/models/model/CustomerInfoModel';
import { ValidType } from '@/models/common/Constants';

export default function DashBoardPopUp({ closeModal, skypassMemberNumber }: any) {
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
  const [wallet, setWallet] = useState<Wallet>();
  const [preference, setPreference] = useState<Preference>();
  const [cnt, setCnt] = useState<Cnt>();
  const [pnr, setPnr] = useState<Array<Pnr>>([]);
  const [etkt, setEtkt] = useState<Array<Etkt>>([]);
  const [boardingLists, setBoardingLists] = useState<Array<BoardingList>>([]);
  const [vocs, setVocs] = useState<Array<Voc>>([]);
  const [smss, setSmss] = useState<Array<Sms>>([]);
  const [snss, setSnss] = useState<Array<Sns>>([]);
  const [emails, setEmails] = useState<Array<Email>>([]);
  const [rows, setRows] = useState<Array<any>>([]);
  const [searchInfo, setSearchInfo] = useState<any>({ skypassMemberNumber: skypassMemberNumber, searchType: 'B' });
  /* 로딩바 */
  const { t } = useTranslation()
  // skypass 조회용 변수 
  const [searchSkypassNm, setSearchSkypassNm] = useState('')
  // profile 조회 api
  const { refetch: refetchProfile, data: responseProfile, isError: isErrorProfile } = useProfile(searchInfo);
  // skypass 조회 api
  const { refetch: refetchSkypass, data: responseSkypass, isError: isErrorSkypass} = useSkypass(skypassMemberNumber);
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
    if(searchInfo.searchType !== ''){
      refetchProfile();
      setKey(Date.now());
      setSearchInfo({...searchInfo, searchType: ''})
    }
  }, [searchInfo])

  useEffect(() => { 
      refetchSkypass()
      setKey(Date.now());
  }, [skypassMemberNumber])

 // 프로필 조회
 useEffect(() => {
  if (isErrorProfile || responseProfile?.successOrNot === 'N') {
    toast({
      type: ValidType.ERROR,
      content: responseProfile?.message,
    });
    setProfile(initProfile)
    setSkypass([])
    setFamily([])
  } else {
    if (responseProfile) {
      setProfile(responseProfile?.data);
      setSearchSkypassNm(responseProfile?.data.skypassInfos[0]?.skypassMemberNumber)
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

  return (
    <Watermark content={sessionInfo.userEmail} className="width-100">
     <Stack direction="Vertical" justifyContent="Start" className={'width-100'} wrap={true}>
  
      <div className="dashBoardWrap">
        <Stack direction="Vertical">
        <Stack style={{ position: 'relative' }}>
            <CloseIcon onClick={closeModal} style={{ position: 'absolute', right: '10px', top: '-2px' }}>
              CloseIcon
            </CloseIcon>
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
                  <div className="value">{profile?.birthDatev?.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}</div>
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
                    {profile?.mobilePhoneNumber
                      // .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
                      // .split('-')
                      // .reduce((pre, cur, idx) => (idx === 1 ? pre + '-****-' : pre + cur), '')
                      }
                  </div>{' '}
                  {/* 가운데 번호 마스킹(*) 필요 */}
                </div>
                <div className="item">
                  <div className="key">이메일</div>
                  {profile?.emailAddress && (
                    <div className="value">{`${'*'.repeat(profile?.emailAddress.split('@')[0].length)}@${
                      profile?.emailAddress.split('@')[1]
                    }`}</div>
                  )}
                  {/* @ 앞부분 마스킹(*) 필요 */}
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
                <div className="value">{selectedSkypass?.effectiveFrom?.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}</div>
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
                  {selectedSkypass.expiredMileages.length > 0 ? (selectedSkypass.expiredMileages.map((list) =>(
                    <TR>
                      <TD className='verticalTableTD'>{list.expiration.length === 4 ? list.expiration?.replace(/(\d{2})(\d{2})/, '20$1-$2') : '평생'}</TD>
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
                      <span className="total">{` ${family?.length} `}</span>
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
                      {family.length > 0 ?  (family.map((list) =>(
                        <TR>
                          <TD className='verticalTableTD'>{list.relationship}</TD>
                          <TD className='verticalTableTD'>{list.korFName}{list.korGName}</TD>
                          <TD className='verticalTableTD'>{list.engFName} {list.engGName}</TD>
                          <TD className='verticalTableTD'>{list.memberStatus}</TD>
                          <TD className='verticalTableTD'>{list.dateOfBirth}</TD>
                          <TD className='verticalTableTD'>{list.skypassNumber}</TD>
                          <TD className='verticalTableTD'>{list.memberStatusNm}</TD>
                          <TD className='verticalTableTD'>{list.createdDate}</TD>
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
                    {family.map((a)=> a.currentMileage).reduce(function add(sum, curVal) { return sum + curVal }, 0)}
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
                      family.map((list: any) => (
                        <tr>
                          <td>{list.relationship}</td>
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
                {batchDate} 기준
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
                      <span className="num">{cnt?.pnr}</span>개
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
                      <span className="num">{cnt?.eTkt}</span>개
                    </div>
                  </Stack>
                </div>
              </div>
              {isListView1.open && isListView1.contents === 'pnr' && (
                <div className="hideContents">
                  <table>
                    <colgroup>
                      <col width="auto" />
                    </colgroup>
                    <thead>
                    <tr>
                        <th>예약번호</th>
                        <th>편명</th>
                        <th>BKG CLS</th>
                        <th>출발일</th>
                        <th>구간</th>
                        <th>예약상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <Stack justifyContent="Between" alignItems={'Start'}>
                            {/* left */}
                            <Stack direction="Vertical">
                              {pnr.map((item, index) => (
                                <Stack gap="MD">
                                  {/* <div>{item?.reservationNum}</div>
                                  <div>{item?.engName}</div> */}
                                </Stack>
                              ))}
                            </Stack>
                            {/* left end */}

                            {/* right */}
                            <div>
                              {pnr.map((item, indx) => (
                                <Stack gap="MD">
                                  {/* <div>{item.arrival}</div>
                                  <div>{item.class}</div>
                                  <div>{item.date}</div>
                                  <div>{item.status}</div> */}
                                </Stack>
                              ))}
                            </div>
                            {/* right end */}
                          </Stack>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {isListView1.open && isListView1.contents === 'etkt' && (
                <div className="hideContents">
                  <table>
                    <colgroup>
                      <col width="15%" />
                      <col width="20%" />           
                      <col width="20%" />
                      <col width="15%" />
                      <col width="10%" />
                      <col width="20%" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>티켓번호</th>
                        <th>편명</th>
                        <th>BKG CLS</th>
                        <th>출발일</th>
                        <th>순서</th>
                        <th>구간</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <Stack justifyContent="Between" alignItems={'Start'}>
                            {/* left */}
                            <Stack direction="Vertical">
                              {etkt.map((item, index) => (
                                <Stack gap="MD">
                                  {/* <div>{item?.ticketNum}</div>
                                  <div>{item?.date}</div>
                                  <div>{item?.arrival}</div>
                                  <div>{item?.status}</div> */}
                                </Stack>
                              ))}
                            </Stack>
                            {/* left end */}
                          </Stack>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
                  {batchDate} 기준
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
                        <span className="num">{wallet?.coupon}</span>개
                      </div>
                    </Stack>
                  </div>
                </div>
                <div className="item middle">
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">항공권할인쿠폰보유여부</div>
                    <div className="value">
                      <span className="num">{wallet?.promotion}</span>
                    </div>
                  </Stack>
                </div>
              </div>
              <div style={{ position: 'relative' }} className="dashBoardBox under width-50">
                <h5 style={{ fontWeight: '400', position: 'absolute', right: 20, top: 10, color: 'gray' }}>
                  {batchDate} 기준
                </h5>
                <div className="top">
                  Preference
                  <div className="kr">선호도</div>
                </div>
                <div className="item middle">
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">최다 탑승 좌석</div>
                    <div className="value">{preference?.seat}</div>
                  </Stack>
                </div>
                <div className="item middle">
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">선호 기내식</div>
                    <div className="value">{preference?.meal}</div>
                  </Stack>
                </div>
                <div className="item middle">
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">골프여행 선호지수</div>
                    <div className="value">{preference?.meal}</div>
                  </Stack>
                </div>
                <div className="item middle">
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">High Class 선호지수</div>
                    <div className="value">{preference?.meal}</div>
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
                {batchDate} 기준
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
                      <span className="num">{cnt?.boarding}</span>회
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
                      <tr>
                        <th>탑승일</th>
                        <th>편명</th>
                        <th>구간</th>
                        <th>CBN CLS</th>
                        <th>티켓번호</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boardingLists.map((item, index) => (
                        <tr>
                          <td>
                            <Stack justifyContent="Between" alignItems={'Start'}>
                              <Stack gap="MD">
                                <div>{item?.itinerary1}</div>
                                <div>{item?.itinerary2}</div>
                                <div>{item?.itinerary3}</div>
                                <div>{item?.itinerary4}</div>
                                <div>{item?.itinerary5}</div>
                              </Stack>
                            </Stack>
                          </td>
                          <td>
                            <Stack justifyContent="Between" alignItems={'Start'}>
                              <Stack gap="MD">
                                <div>{item?.ticketNo}</div>
                              </Stack>
                            </Stack>
                          </td>
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
                {batchDate} 기준
              </h5>
              <div className="top">communication records</div>
              <div className="itemWrap">
                <Stack justifyContent="Between" gap="LG">
                  <div className="item middle" style={{ flex: '1' }}>
                    <Stack justifyContent="Between" alignItems={'cencter'}>
                      <div className="key">
                        <button
                          onClick={() => {
                            setIsListView3({ open: true, contents: 'call' });
                          }}
                        >
                          상담
                        </button>
                      </div>
                      <div className="value">
                        <span className="num">{cnt?.call}</span>
                      </div>
                    </Stack>
                  </div>
                  <div className="item middle" style={{ flex: '1' }}>
                    <Stack justifyContent="Between" alignItems={'cencter'}>
                      <div className="key">
                        <button
                          onClick={() => {
                            setIsListView3({ open: true, contents: 'internet' });
                          }}
                        >
                          캠페인
                        </button>
                      </div>
                      <div className="value">
                        <span className="num">{cnt?.internet}</span>
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
                        <span className="num">{cnt?.voc}</span>
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
                        <span className="num">{cnt?.sms}</span>
                      </div>
                    </Stack>
                  </div>
                </Stack>
              </div>
              {isListView3.open && isListView3.contents === 'call' && (
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
                        </tr>
                        <tr>
                          <td>챗봇</td>
                        </tr>
                        <tr>
                          <td>채팅</td>
                        </tr>
                    </tbody>
                  </table>
                </div>
              )}
              {isListView3.open && isListView3.contents === 'internet' && (
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
                        </tr>
                        <tr>
                          <td>SMS/LMS</td>
                        </tr>
                        <tr>
                          <td>APP PUSH</td>
                        </tr>
                        <tr>
                          <td>E-MAIL</td>
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
                        </tr>
                        <tr>
                          <td>제언</td>
                        </tr>
                        <tr>
                          <td>Disruption</td>
                        </tr>
                    </tbody>
                  </table>
                </div>
              )}
            
              {isListView3.open && isListView3.contents === 'tms' && (
                <div className="hideContents">
                  <table className="centerTable">
                    <colgroup>
                      <col width="25%" />
                      <col width="25%" />
                      <col width="25%" />
                      <col width="25%" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>날짜</th>
                        <th>횟수</th>
                        <th>상담자</th>
                        <th>채널</th>
                      </tr>
                    </thead>
                    <tbody>
                      {snss.map((item, index) => (
                        <tr>
                          <td>{item?.date}</td>
                          <td>{item?.useCnt}</td>
                          <td>{item?.counselor}</td>
                          <td>{item?.channel}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <button
                type="button"
                className={'viewMore ' + (isListView3.open ? 'true' : 'false')}
                onClick={(event) => {
                  if (isListView3.contents === '') {
                    setIsListView3({ open: !isListView3.open, contents: 'call' });
                  } else {
                    setIsListView3({ open: !isListView3.open, contents: '' });
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
    </Watermark>
  );
}


