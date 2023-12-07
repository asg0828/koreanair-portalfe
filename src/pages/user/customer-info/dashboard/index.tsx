import { useCustomerInfo } from '@/hooks/queries/useCustomerInfoQueires';
import { htmlTagReg } from '@/utils/RegularExpression';
import { Button, Modal, Select, Stack, TextField, Typography, useToast, SelectOption } from '@components/ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SelectValue } from '@mui/base/useSelect';
import {
  profileData,
  skypassData1,
  skypassData2,
  familyMemberData,
  walletData,
  preferenceData,
  cntData,
  pnrData,
  eTktData,
  boardingListData,
  vocData,
  callData,
  internetData,
  smsData,
  emailData,
  snsData,
} from './data';
import {
  FamilyMember,
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
} from '@/models/model/CustomerInfoModel';

export default function List() {
  const today = new Date();
  const yesterday = new Date(today.setDate(today.getDate() - 1));
  const batchDate = `${yesterday.getFullYear()}-${(`0` + yesterday.getMonth() + 2).slice(-2)}-${(
    `0` + yesterday.getDate()
  ).slice(-2)}`;
  const [profile, setProfile] = useState<Profile>();
  const [skypass, setSkypass] = useState<Array<Skypass>>();
  const [family, setFamily] = useState<FamilyMember>();
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
  const [searchInfo, setSearchInfo] = useState<any>({ skypassNum: '', oneId: '' });
  const [selectedSkypass, setSelectedSkypass] = useState<any>([]);
  // const [skypassList, setSkypassList] = useState<Array<any>>([]);
  const intervalId = useRef<number | NodeJS.Timer | null>(null);
  const { refetch, data: response, isError } = useCustomerInfo(searchInfo);
  const { toast } = useToast();

  const validation = () => {
    // 검색 조건 자체는 두개다 들어가도 가능
    // 회원당 skypass는 일대다 관계이므로 oneId로 검색할 경우 skypass list를
    let searchError = false;
    if (
      searchInfo.skypassNum.replace(htmlTagReg, '').trim() === '' &&
      searchInfo.oneId.replace(htmlTagReg, '').trim() === ''
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
    setSkypass([]);

    // 유효성 검사 실패 시 종료
    const validation = () => {
      let searchError = false;
      if (
        searchInfo.skypassNum.replace(htmlTagReg, '').trim() === '' &&
        searchInfo.oneId.replace(htmlTagReg, '').trim() === ''
      ) {
        setOpen(true);
        searchError = true;
      }
      return searchError;
    };

    if (validation()) return;
    if (searchInfo.oneId === 'S199206239090026' || searchInfo.skypassNum === '112423935550') {
      setProfile(profileData[0]);
      setSkypass(skypassData1);
      setFamily(familyMemberData[0]);
      setSelectedSkypass(skypassData1[0]);
      setWallet(walletData);
      setPreference(preferenceData[0]);
      setCnt(cntData[0]);
      setPnr(pnrData);
      setEtkt(eTktData);
      setBoardingLists(boardingListData);
      setVocs(vocData);
      setInternets(internetData);
      setCalls(callData);
      setSmss(smsData);
      setEmails(emailData);
      setSnss(snsData);
      setSearchInfo({ ...searchInfo, skypassSelect: '112423935550' });
    } else if (searchInfo.oneId === 'S199604132974321' || searchInfo.skypassNum === '112917446366') {
      setProfile(profileData[1]);
      setSkypass(skypassData2);
      setFamily(familyMemberData[3]);
      setSelectedSkypass(skypassData2[0]);
      setWallet(walletData);
      setPreference(preferenceData[1]);
      setCnt(cntData[1]);
      setPnr(pnrData);
      setEtkt(eTktData);
      setBoardingLists(boardingListData);
      setVocs(vocData);
      setInternets(internetData);
      setCalls(callData);
      setSmss(smsData);
      setEmails(emailData);
      setSnss(snsData);
      setSearchInfo({ ...searchInfo, skypassSelect: '112917446366' });
    }
    // refetch();
  }, [refetch, searchInfo, validation]);

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
    setSearchInfo({ ...searchInfo, [id]: value });
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
    id?: String
  ) => {
    if (searchInfo.oneId === 'S199206239090026' || searchInfo.skypassNum === '112423935550') {
      setSearchInfo({ ...searchInfo, [`${id}`]: value });
      if (value === '112423935550') {
        setFamily(familyMemberData[0]);
      } else if (value === '112345789375') {
        setFamily(familyMemberData[1]);
      } else if (value === '112617209394') {
        setFamily(familyMemberData[2]);
      }
    } else if (searchInfo.oneId === 'S199604132974321' || searchInfo.skypassNum === '112917446366') {
      setSearchInfo({ ...searchInfo, [`${id}`]: value });
      if (value === '112917446366') {
        setFamily(familyMemberData[3]);
      } else if (value === '112557098776') {
        setFamily(familyMemberData[4]);
      } else if (value === '112111687088') {
        setFamily(familyMemberData[5]);
      }
    }
  };
  useEffect(() => {
    setSelectedSkypass(skypass?.find((item) => item.skypassNum === searchInfo.skypassSelect));
  }, [searchInfo.skypassSelect]);

  useEffect(() => {
    if (isError || response?.successOrNot === 'N') {
      toast({
        type: 'Error',
        content: '조회 중 에러가 발생했습1니다.',
      });
    } else {
      if (response?.data) {
        // response.data.contents.forEach(() => {});
        // setRows(response.data.contents);
      }
    }
  }, [response, isError, toast]);

  return (
    <Stack direction="Vertical" justifyContent="Start" className={'width-100'} wrap={true}>
      {/* searchBar 영역 */}
      <Stack>
        <div className="componentWrapper" style={{ width: '100%' }}>
          <TextField
            id="skypassNum"
            value={searchInfo.skypassNum}
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
            value={searchInfo.oneId}
            id="oneId"
            appearance="Outline"
            placeholder="One ID NO."
            size="LG"
            textAlign="left"
            onChange={onchangeInputHandler}
          />
        </div>

        <Button priority="Primary" appearance="Contained" size="LG" onClick={handleSearch}>
          검색
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
          <Stack style={{ position: 'relative' }}>
            <Typography variant="h3" className="dashboardTitle">
              Customer Info.
            </Typography>
            <h5 style={{ position: 'absolute', right: 10, bottom: 0, color: 'gray' }}>업데이트 날짜 : {batchDate}</h5>
          </Stack>
          <div className="topCard">
            <div className="dashBoardBox n1">
              <div className="name">
                {profile?.name}
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
                  <div className="value">{profile?.birth}</div>
                </div>
                <div className="item">
                  <div className="key">만나이</div>
                  <div className="value">{profile?.age}</div>
                </div>
                <div className="item">
                  <div className="key">성별</div>
                  <div className="value">{profile?.gender}</div>
                </div>
                <div className="item">
                  <div className="key">자택번호</div>
                  <div className="value">{profile?.homePhoneNumberInfo}</div>
                </div>
                <div className="item">
                  <div className="key">휴대폰번호</div>
                  <div className="value">{profile?.mobilePhoneNumberInfone}</div>
                </div>
                <div className="item">
                  <div className="key">이메일</div>
                  <div className="value">{profile?.emailAddress}</div>
                </div>
              </div>
            </div>
            <div className="dashBoardBox n2">
              <div className="top" style={{ position: 'relative' }}>
                SKYPASS
                <div className="kr">스카이패스</div>
                {skypass && skypass.length > 0 && (
                  <Select
                    id="skypassSelect"
                    defaultValue={skypass.length > 0 ? skypass[0].skypassNum : ''}
                    appearance="Outline"
                    placeholder="스카이패스선택"
                    style={{ maxHeight: '80%', position: 'absolute', right: 0, fontSize: '80%', bottom: 2 }}
                    value={searchInfo.skypassSelect}
                    onChange={(
                      e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
                      value: SelectValue<{}, false>
                    ) => {
                      onchangeSelectHandler(e, value, 'skypassSelect');
                    }}
                  >
                    {skypass.map((item: any, index: number) => (
                      <SelectOption key={index} value={item.skypassNum} style={{ maxHeight: '70%', fontSize: '13px' }}>
                        {item.skypassNum}
                      </SelectOption>
                    ))}
                  </Select>
                )}
              </div>
              <div className="item">
                <div className="key">회원번호</div>
                <div className="value">{selectedSkypass?.skypassNum}</div>
              </div>
              <div className="item">
                <div className="key">회원등급</div>
                <div className="value">{selectedSkypass?.skypassGrade}</div>
              </div>
              <div className="item">
                <div className="key">휴면여부</div>
                <div className="value">{selectedSkypass?.useYn}</div>
              </div>
              <div className="item">
                <div className="key">현등급최초시작일</div>
                <div className="value">{selectedSkypass?.gradeStartDate}</div>
              </div>
              <div className="item">
                <div className="key">잔여 마일리지</div>
                <div className="value">{selectedSkypass?.mileage}</div>
              </div>
              <div className="item">
                <div className="key">소멸예정 마일리지</div>
                <div className="value">{selectedSkypass?.expireMileage}</div>
              </div>
              <div className="item">
                <div className="key">등급유지조건(마일리지+횟수+기간)</div>
                <div className="value">{selectedSkypass?.gradeCondtion}</div>
              </div>
              <div className="item">
                <div className="key">승급조건(마일리지+횟수)</div>
                <div className="value">{selectedSkypass?.upgradeCondition}</div>
              </div>
            </div>
            <div className="dashBoardBox n3">
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
                  등록가족
                  <span className="num">{family?.familyCnt}</span>명
                </div>
                <div className="right">
                  합산가능마일리지
                  <span className="num">{family?.mergeMileage}</span>
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
                      family.familyList.length > 0 &&
                      family.familyList.map((list, index) => (
                        <tr>
                          <td>{list.relationship}</td>
                          <td>{list.code}</td>
                          <td>{list.name}</td>
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
            <div className="dashBoardBox under width-50">
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
                        PNR
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
                        <th>Current PNR</th>
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
              <div className="dashBoardBox under width-50">
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
                    <div className="key">유효프로모션쿠폰</div>
                    <div className="value">
                      <span className="num">{wallet?.promotion}</span>개
                    </div>
                  </Stack>
                </div>
                <div className="item middle">
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">전자우대할인권</div>
                    <div className="value">
                      <span className="num">{wallet?.complimentary}</span>개
                    </div>
                  </Stack>
                </div>
              </div>
              <div className="dashBoardBox under width-50">
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
              </div>
            </Stack>
          </Stack>
          <Typography variant="h3" className="dashboardTitle">
            Customer History.
          </Typography>
          <Stack className="width-100" gap="LG" alignItems="Start">
            <div className="dashBoardBox under width-50">
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
                <div className="item middle">
                  <Stack justifyContent="Between" alignItems={'cencter'}>
                    <div className="key">
                      <button
                        onClick={() => {
                          setIsListView2(true);
                        }}
                      >
                        Pet 동반횟수
                      </button>
                    </div>
                    <div className="value">
                      <span className="num">{cnt?.pet}</span>회
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
            <div className="dashBoardBox under width-50">
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
                          인터넷
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
