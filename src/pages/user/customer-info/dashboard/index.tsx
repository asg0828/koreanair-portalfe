import { useProfile, useSkypass } from '@/hooks/queries/useCustomerInfoQueires';
import { htmlTagReg } from '@/utils/RegularExpression';
import { Button, Modal, Select, Stack, TextField, Typography, useToast, SelectOption } from '@components/ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SelectValue } from '@mui/base/useSelect';
import { initFamily, initProfile, initSkypass } from './data';
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
  Internet,
  Call,
  Sms,
  Sns,
  Email,
  FamilyMembers,
} from '@/models/model/CustomerInfoModel';
import { ValidType } from '@/models/common/Constants';
import { cloneDeep } from 'lodash'
export default function List() {
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
  const [calls, setCalls] = useState<Array<Call>>([]);
  const [vocs, setVocs] = useState<Array<Voc>>([]);
  const [internets, setInternets] = useState<Array<Internet>>([]);
  const [smss, setSmss] = useState<Array<Sms>>([]);
  const [snss, setSnss] = useState<Array<Sns>>([]);
  const [emails, setEmails] = useState<Array<Email>>([]);
  const [rows, setRows] = useState<Array<any>>([]);
  const [searchInfo, setSearchInfo] = useState<any>({
    skypassMemberNumber: '',
    oneidNo: '',
    searchType: '',
  });
  const [selectedSkypass, setSelectedSkypass] = useState<Skypass>(initSkypass);
  const intervalId = useRef<number | NodeJS.Timer | null>(null);
  const { toast } = useToast();
  // skypass 조회용 변수 
  const [searchSkypassNm, setSearchSkypassNm] = useState('')
  // profile 조회 api
  const { refetch: refetchProfile, data: responseProfile, isError: isErrorProfile } = useProfile(searchInfo);
  // skypass 조회 api
  const { refetch: refetchSkypass, data: responseSkypass, isError: isErrorSkypass} = useSkypass(searchSkypassNm);


  const validation = () => {
    // 검색 조건 자체는 두개다 들어가도 가능
    // 회원당 skypass는 일대다 관계이므로 phoneNumber로 검색할 경우 skypass list를
    let searchError = false;
    if (
      searchInfo.skypassMemberNumber.replace(htmlTagReg, '').trim() === '' &&
      searchInfo.oneidNo.replace(htmlTagReg, '').trim() === ''
    ) {
      setOpen(true);
      searchError = true;
    }
    return searchError;
  };

  // 등록가족 상세 모달 오픈 버튼
  const retrieveFamilyInfo = () => {
    setOpenFamilyInfo(true);
  };

  const handleSearch = useCallback(() => {
    // 유효성 검사 실패 시 종료
    const validation = () => {
      let searchError = false;
      if (
        searchInfo.skypassMemberNumber.replace(htmlTagReg, '').trim() === '' &&
        searchInfo.oneidNo.replace(htmlTagReg, '').trim() === ''
      ) {
        setOpen(true);
        searchError = true;
      }
      return searchError;
    };

    if (validation()) return;
    setSkypass([]);
    if(searchInfo.skypassMemberNumber !== '' ){
      setSearchInfo({...searchInfo, searchType: 'B'})
    } else if(searchInfo.oneidNo !== ''){
      setSearchInfo({...searchInfo, searchType: 'A'})
    }
  }, [refetchProfile, searchInfo, validation]);

  // 초기화 버튼
  const onClear = () => {
    setSearchInfo({ 
      skypassMemberNumber: '',
      oneidNo: '',
      searchType: ''})
  }

  useEffect(() => {
    if(searchInfo.searchType !== ''){
      refetchProfile();
      setSearchInfo({...searchInfo, searchType: ''})
    }
  }, [searchInfo.searchType])

  // style > 배경색 변경
  useEffect(() => {
    const bodyElement: HTMLElement | null = document.getElementById('body');
    if (bodyElement) {
      bodyElement.style.backgroundColor = '#f8f9fc';
      return () => {
        bodyElement.style.backgroundColor = '';
      };
    }
  }, []);

  //검색 조건 모달 state
  const [isOpen, setOpen] = useState(false);

  // 등록가족 상세 버튼 모달 state
  const [isOpenFamilyInfo, setOpenFamilyInfo] = useState(false);

  const onchangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearInterval(intervalId.current as number);
    const { id, value } = e.target;
    setSearchInfo({ ...searchInfo, [id]: value});
  };

  const [isListView1, setIsListView1] = useState({ open: false, contents: '' });
  const [isListView2, setIsListView2] = useState(false);
  const [isListView3, setIsListView3] = useState({ open: false, contents: '' });

  // 클릭 더보기 리스트 교체 함수
  const listClickChange = (flag: string) => {
    // 눌렀을때 -> LIST에 값이 들어감                                                       -> STATE변화 (열어줘야됨)
    // LIST에 값이 있는 상태로 누르면(다시 누르면) -> LIST가 비워짐      -> STATE변화(닫아줘야됨)
    // LIST에 값이 있는 상태로 다른걸 누르면 -> LIST가 다른걸로 채워짐  -> STATE변화(다른걸 열어줘야됨/ 열어주되 LIST를 갈아끼워줘야됨 )
    // LIST를 STATE로 관리하고 값을 넣었다 뺐다 하면서 USEeFFECT로 열고 닫고 해주면 될거같은데 -> 값이 변화하면 무조건 LIST가 열리게 값 변화가 없으면 닫기
  };

  /* select 입력 함수 */
  const onchangeSelectHandler = (
    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
    value: SelectValue<{}, false>,
  ) => {
    setSearchSkypassNm(String(value))
  };
  

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
  }, [responseProfile, isErrorProfile]);

  useEffect(() => { 
    if(searchSkypassNm !== '' && profile?.skypassInfos[0]?.skypassMemberNumber !== '') {
      refetchSkypass()
      setSearchInfo({...searchInfo, searchType: ''})
    }
  }, [searchSkypassNm])

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
  }, [isErrorSkypass, responseSkypass]);

	useEffect(() => {
		reset()

	}, [])
  const reset = () => {
		setProfile((state: Profile) => {
			let rtn = cloneDeep(state)
			rtn = cloneDeep(initProfile)
			return rtn
		})
    setSkypass((prevState) => {
			return cloneDeep([])
		})
    setFamily((prevState) => {
			return cloneDeep([])	
		})
    setSelectedSkypass((state: Skypass) => {
			let rtn = cloneDeep(state)
			rtn = cloneDeep(initSkypass)
			return rtn
		})
  }

  return (
    <Stack direction="Vertical" justifyContent="Start" className={'width-100'} wrap={true}>
      {/* searchBar 영역 */}

      <Stack className={'width-100'}>
        <div className="componentWrapper" style={{ width: '100%' }}>
          <TextField
            id="skypassMemberNumber"
            value={searchInfo.skypassMemberNumber}
            appearance="Outline"
            placeholder="Skypass Number"
            size="LG"
            textAlign="left"
            onChange={onchangeInputHandler}
            autoFocus
          />
        </div>
        <div className="componentWrapper" style={{ width: '100%' }}>
          <TextField
            value={searchInfo.oneidNo}
            id="oneidNo"
            appearance="Outline"
            placeholder="One ID NO."
            size="LG"
            textAlign="left"
            onChange={onchangeInputHandler}
          />
        </div>

        <Button priority="Primary" appearance="Contained" size="LG" onClick={handleSearch}>
          <span className="searchIcon"></span>
          검색
        </Button>
        <Button size="LG" onClick={onClear}>
          초기화
        </Button>
        <Modal open={isOpen} onClose={() => setOpen(false)}>
          <Modal.Header>오류</Modal.Header>
          <Modal.Body>검색 조건을 입력해주세요</Modal.Body>
          <Modal.Footer>
            <Button
              priority="Primary"
              appearance="Contained"
              onClick={() => {
                setOpen(false);
              }}
            >
              확인
            </Button>
          </Modal.Footer>
        </Modal>
      </Stack>
      {/* searchBar 영역 */}
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
                <div className="value">{selectedSkypass?.effectiveFrom.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')}</div>
              </div>
              <div className="item">
                <div className="key">잔여 마일리지</div>
                <div className="value">{selectedSkypass?.remainMileage}</div>
              </div>
              <div className="item">
                <div className="key">소멸예정 마일리지</div>
                <div className="value">{selectedSkypass?.expiredMileages[0]?.expiredMileage}</div>
              </div>
            </div>
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
                <Modal open={isOpenFamilyInfo} onClose={() => setOpenFamilyInfo(false)}>
                  <Modal.Header>등록가족 상세 페이지</Modal.Header>
                  <Modal.Body>등록가족 상세 페이지</Modal.Body>
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
                        <th>예약</th>
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
                                  <div>{item?.reservationNum}</div>
                                  <div>{item?.engName}</div>
                                </Stack>
                              ))}
                            </Stack>
                            {/* left end */}

                            {/* right */}
                            <div>
                              {pnr.map((item, indx) => (
                                <Stack gap="MD">
                                  <div>{item.arrival}</div>
                                  <div>{item.class}</div>
                                  <div>{item.date}</div>
                                  <div>{item.status}</div>
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
                      <col width="auto" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>E-TKT</th>
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
                                  <div>{item?.ticketNum}</div>
                                  <div>{item?.date}</div>
                                  <div>{item?.arrival}</div>
                                  <div>{item?.status}</div>
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
                      <col width="70%" />
                      <col width="30%" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Itinerary Details</th>
                        <th>Ticket No.</th>
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
                          통화
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
                          채팅상담
                        </button>
                      </div>
                      <div className="value">
                        <span className="num">{cnt?.internet}</span>
                      </div>
                    </Stack>
                  </div>
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
                </Stack>
                <Stack justifyContent="Between" gap="LG">
                  <div className="item middle" style={{ flex: '1' }}>
                    <Stack justifyContent="Between" alignItems={'cencter'}>
                      <div className="key">
                        <button
                          onClick={() => {
                            setIsListView3({ open: true, contents: 'sms' });
                          }}
                        >
                          SMS
                        </button>
                      </div>
                      <div className="value">
                        <span className="num">{cnt?.sms}</span>
                      </div>
                    </Stack>
                  </div>
                  <div className="item middle" style={{ flex: '1' }}>
                    <Stack justifyContent="Between" alignItems={'cencter'}>
                      <div className="key">
                        <button
                          onClick={() => {
                            setIsListView3({ open: true, contents: 'email' });
                          }}
                        >
                          E-mail
                        </button>
                      </div>
                      <div className="value">
                        <span className="num">{cnt?.email}</span>
                      </div>
                    </Stack>
                  </div>
                  <div className="item middle" style={{ flex: '1' }}>
                    <Stack justifyContent="Between" alignItems={'cencter'}>
                      <div className="key">
                        <button
                          onClick={() => {
                            setIsListView3({ open: true, contents: 'sns' });
                          }}
                        >
                          SNS
                        </button>
                      </div>
                      <div className="value">
                        <span className="num">{cnt?.sns}</span>
                      </div>
                    </Stack>
                  </div>
                </Stack>
              </div>
              {isListView3.open && isListView3.contents === 'call' && (
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
                        <th>발송일</th>
                        <th>휴대폰번호</th>
                        <th>발송상태</th>
                        <th>상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calls.map((item, index) => (
                        <tr>
                          <td>{item?.date}</td>
                          <td>{item?.phoneNumber}</td>
                          <td>{item?.counselor}</td>
                          <td>{item?.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {isListView3.open && isListView3.contents === 'internet' && (
                <div className="hideContents">
                  <table className="centerTable">
                    <colgroup>
                      <col width="25%" />
                      <col width="25%" />
                      <col width="25%" />
                      <col width="25%" />
                    </colgroup>
                    <thead>
                      <tr className="width-100">
                        <th>날짜</th>
                        <th>채널</th>
                        <th>티켓번호</th>
                        <th>도착지</th>
                      </tr>
                    </thead>
                    <tbody>
                      {internets.map((item, index) => (
                        <tr>
                          <td>{item?.date}</td>
                          <td>{item?.channel}</td>
                          <td>{item?.ticketNum}</td>
                          <td>{item?.arrival}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {isListView3.open && isListView3.contents === 'voc' && (
                <div className="hideContents">
                  <table className="centerTable">
                    <colgroup>
                      <col width="20%" />
                      <col width="20%" />
                      <col width="20%" />
                      <col width="20%" />
                      <col width="20%" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>횟수</th>
                        <th>날짜</th>
                        <th>채널</th>
                        <th>타입</th>
                        <th>내용</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vocs.map((item, index) => (
                        <tr>
                          <td>{item?.cnt}</td>
                          <td>{item?.date}</td>
                          <td>{item?.channel}</td>
                          <td>{item?.type}</td>
                          <td>{item?.content}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {isListView3.open && isListView3.contents === 'sms' && (
                <div className="hideContents">
                  <table className="centerTable">
                    <colgroup>
                      <col width="20%" />
                      <col width="20%" />
                      <col width="20%" />
                      <col width="20%" />
                      <col width="20%" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>횟수</th>
                        <th>날짜</th>
                        <th>휴대폰번호</th>
                        <th>타입</th>
                        <th>내용</th>
                      </tr>
                    </thead>
                    <tbody>
                      {smss.map((item, index) => (
                        <tr>
                          <td>{item?.sendCnt}</td>
                          <td>{item?.date}</td>
                          <td>{item?.phoneNum}</td>
                          <td>{item?.status}</td>
                          <td>{item?.content}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {isListView3.open && isListView3.contents === 'email' && (
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
                        <th>내용</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emails.map((item, index) => (
                        <tr>
                          <td>{item?.date}</td>
                          <td>{item?.useCnt}</td>
                          <td>{item?.counselor}</td>
                          <td>{item?.content}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {isListView3.open && isListView3.contents === 'sns' && (
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
  );
}


